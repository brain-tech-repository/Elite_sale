"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface FormCardFooterProps {
	submitLabel?: string; // default: "Submit"
	isLoading?: boolean; // default: false
}

export function FormCardFooter({
	submitLabel = "Submit",
	isLoading = false,
}: FormCardFooterProps) {
	return (
		<CardFooter className="mt-4 flex w-full justify-center border-t pt-2">
			<Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
				{submitLabel}
			</Button>
		</CardFooter>
	);
}
