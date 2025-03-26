"use client";

import type React from "react";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Label } from "@/components/Label";
import { TextInput } from "@/components/TextInput";
import { Description } from "@/components/Description";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/Button";

export default function Home() {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState<string | undefined>();

	const validateEmail = (value: string) => {
		if (!value) {
			setEmailError("Email is required");
			return false;
		}

		if (!/\S+@\S+\.\S+/.test(value)) {
			setEmailError("Please enter a valid email address");
			return false;
		}

		setEmailError(undefined);
		return true;
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		if (emailError) validateEmail(value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const isValid = validateEmail(email);

		if (isValid) {
			alert(`Form submitted with email: ${email}`);
		}
	};

	return (
		<main className="flex min-h-screen flex flex-col gap-[55px] items-center justify-center">
			<div className="w-full max-w-md flex flex-col p-[22px] gap-[22px] rounded-[4px] border border-[var(--rosetta-gray-800)]">
				<h1>Field Example</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
					<Field name="email" error={emailError} required>
						<Label>Email Address</Label>
						<Description>We&apos;ll never share your email.</Description>
						<TextInput>
							<TextInput.Control
								placeholder="Enter your email"
								type="email"
								value={email}
								onChange={handleEmailChange}
								onBlur={() => validateEmail(email)}
							/>
						</TextInput>
						<ErrorMessage />
					</Field>
					<Field name="password" required>
						<Label>Password</Label>
						<TextInput>
							<TextInput.Control
								placeholder="Enter your password"
								type="password"
							/>
							<TextInput.Slot>
								<Button label="EYE" variant="text" size="small" />
							</TextInput.Slot>
						</TextInput>
					</Field>

					<Button label="Submit" />
				</form>
			</div>
			<div className="w-full max-w-md flex flex-col p-[22px] gap-[22px] rounded-[4px] border border-[var(--rosetta-gray-800)]">
				<h1>Field Example</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
					<Field name="product">
						<Label>Product name</Label>
						<TextInput>
							<TextInput.Control
								placeholder="Enter the name of the product"
								value={email}
								onChange={handleEmailChange}
								onBlur={() => validateEmail(email)}
							/>
						</TextInput>
						<ErrorMessage />
					</Field>
					<Field name="price">
						<Label>Price</Label>
						<TextInput>
							<TextInput.Slot>$</TextInput.Slot>
							<TextInput.Control placeholder="0.00" type="number" />
						</TextInput>
					</Field>
					<Field name="disabled">
						<Label>Disabled field</Label>
						<TextInput>
							<TextInput.Control
								disabled
								placeholder="This is well and truly disabled"
							/>
						</TextInput>
					</Field>

					<Button label="Submit" />
				</form>
			</div>
		</main>
	);
}
