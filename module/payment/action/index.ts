"use server";
import {auth} from "@/lib/auth";
import { getRemainingLimits, updateUserTier, updatePolarCustomerId } from "../lib/subscription";
import { headers } from "next/headers";
import { polarClient } from "../config/polar";
import prisma from "@/lib/db";

export interface SubscriptionData {
    user: {
        id: string;
        name: string;
        email: string;
        subscriptionTier: string;
        subscriptionStatus: string | null;
        polarCustomerId: string | null;
        polarSubscriptionId: string | null;
    } | null;
    limits: {
        tier: "FREE" | "PRO";
        repositories: {
            current: number;
            limit: number | null;
            canAdd: boolean;
        };
        reviews: {
            [repositoryId: string]: {
                current: number;
                limit: number | null;
                canAdd: boolean;
            };
        };
    } | null;
}

export async function getSubscriptionData(): Promise<SubscriptionData> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return {user: null, limits: null};
    }

    const user = await prisma.user.findUnique({
        where: {id: session.user.id},
    });

    if (!user) {
        return {user: null, limits: null};
    }

    const limits = await getRemainingLimits(user.id);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscriptionTier: user.subscriptionTier || "FREE",
            subscriptionStatus: user.subscriptionStatus || null,
            polarCustomerId: user.polarCustomerId || null,
            polarSubscriptionId: user.polarSubscriptionId || null,
        },
        limits,
    }
}

export async function syncSubscriptionStatus() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        return { success: false, message: "No user found" };
    }

    let polarCustomerId = user.polarCustomerId;
    let subscriptions: any[] = [];
    let activeCustomerFound = false;

    try {
        // Find all customers with this email
        const customersResp = await polarClient.customers.list({
            email: user.email,
        });

        const customers = customersResp.result?.items || [];
        
        // Loop through all customers to find one with an active subscription
        for (const customer of customers) {
            const result = await polarClient.subscriptions.list({
                customerId: customer.id,
            });
            const subs = result.result?.items || [];
            
            if (subs.some(sub => sub.status === 'active')) {
                subscriptions = subs;
                polarCustomerId = customer.id;
                activeCustomerFound = true;
                break;
            }
            
            // If no active, but has subscriptions, store them just in case (we prefer active, but take the latest otherwise)
            if (!activeCustomerFound && subs.length > 0) {
                subscriptions = subs;
                polarCustomerId = customer.id;
            }
        }

        // Update the customer ID in DB if it changed
        if (polarCustomerId && polarCustomerId !== user.polarCustomerId) {
            await updatePolarCustomerId(user.id, polarCustomerId);
        }

    } catch (error) {
        console.error("Failed to sync subscriptions:", error);
        return { success: false, error: "Failed to sync with Polar" };
    }

    if (subscriptions.length > 0) {
        const activeSub = subscriptions.find((sub: any) => sub.status === 'active');
        const latestSub = subscriptions[0]; // Assuming API returns sorted or we should sort

        if (activeSub) {
            await updateUserTier(user.id, "PRO", "ACTIVE", activeSub.id);
            return { success: true, status: "ACTIVE" };
        } else if (latestSub) {
            const status = latestSub.status === 'canceled' ? 'CANCELED' : 'EXPIRED';
            if (latestSub.status !== 'active') {
                await updateUserTier(user.id, "FREE", status, latestSub.id);
            }
            return { success: true, status };
        }
    }

    return { success: true, status: "NO_SUBSCRIPTION" };
}