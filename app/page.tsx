"use client";

import type React from "react";

import { useState } from "react";
import { Field } from "@/components/Field";
import { Label } from "@/components/Label";
import { TextInput } from "@/components/TextInput";
import { Description } from "@/components/Description";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { usePhoneFormat } from "@/hooks/usePhoneFormat";

export default function Home() {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState<string | undefined>();
	const [phone, setPhone] = useState("");
	usePhoneFormat(phone, setPhone);

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
		<main className="flex min-h-screen flex flex-col gap-[55px] py-[55px] items-center justify-center">
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

					<Button label="Submit" type="submit" />
				</form>
			</div>
			<div className="w-full max-w-md flex flex-col p-[22px] gap-[22px] rounded-[4px] border border-[var(--rosetta-gray-800)]">
				<h1>Field Example</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
					<Field name="product">
						<Label>Product name</Label>
						<TextInput>
							<TextInput.Control placeholder="Enter the name of the product" />
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
					<Field name="website">
						<Label>Website</Label>
						<TextInput>
							<TextInput.Slot>https://</TextInput.Slot>
							<TextInput.Control placeholder="url" />
							<TextInput.Slot>.com</TextInput.Slot>
						</TextInput>
					</Field>
					<Field name="phone">
						<Label>Phone number</Label>
						<TextInput className="pl-[0px]">
							<TextInput.Slot>
								<Select className="w-auto border-r-1 border-r-[var(--rosetta-gray-800)]">
									<Select.Control>
										<Select.Option>+1 (US/CA)</Select.Option>
										<Select.Option>+52 (MX)</Select.Option>
										<Select.Option>+86 (CN)</Select.Option>
										<Select.Option>+998 (UZ)</Select.Option>
									</Select.Control>
								</Select>
							</TextInput.Slot>
							<TextInput.Control placeholder="123-456-7890" type="tel" />
						</TextInput>
					</Field>
					<Field name="select">
						<Label>Select</Label>
						<Select>
							<Select.Control>
								<Select.Option>1</Select.Option>
								<Select.Option>2</Select.Option>
								<Select.Option>3</Select.Option>
							</Select.Control>
						</Select>
					</Field>
					<Field name="select-with-slot">
						<Label>Select with a slot</Label>
						<Select>
							<Select.Slot>$</Select.Slot>
							<Select.Control>
								<Select.Option>100</Select.Option>
								<Select.Option>200</Select.Option>
								<Select.Option>300</Select.Option>
							</Select.Control>
						</Select>
					</Field>
					<Field name="phone-with-formatting">
						<Label>Phone number with formatting</Label>
						<TextInput className="pl-[0px]">
							<TextInput.Slot>
								<Select className="w-auto">
									<Select.Control>
										<Select.Option>+1 (US/CA)</Select.Option>
										<Select.Option>+52 (MX)</Select.Option>
										<Select.Option>+86 (CN)</Select.Option>
										<Select.Option>+998 (UZ)</Select.Option>
									</Select.Control>
								</Select>
							</TextInput.Slot>
							<TextInput.Control
								placeholder="123-456-7890"
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</TextInput>
					</Field>
					<Button label="Submit" type="submit" />
				</form>
			</div>
		</main>
	);
}
