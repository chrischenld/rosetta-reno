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
import { Dropdown } from "@/components/Dropdown";
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
				<h1>More Examples</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
					<Field name="price">
						<Label>Price</Label>
						<TextInput>
							<TextInput.Slot>$</TextInput.Slot>
							<TextInput.Control placeholder="0.00" type="number" />
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
						<TextInput>
							<TextInput.Slot className="pl-0">
								<Select>
									<Select.Control>
										<Select.Option>+1 (USA)</Select.Option>
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
						<TextInput>
							<TextInput.Slot className="pl-0">
								<Select>
									<Select.Control>
										<Select.Option>+1 (USA)</Select.Option>
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
					<Field name="disabled">
						<Label>Disabled field</Label>
						<TextInput>
							<TextInput.Control
								disabled
								placeholder="This is well and truly disabled"
							/>
						</TextInput>
					</Field>
					<Button label="Submit" type="submit" />
				</form>
			</div>
			<div className="w-full max-w-md flex flex-col p-[22px] gap-[22px] rounded-[4px] shadow-[0px_0.17px_2.21px_0px_#00000005,0px_0.4px_5.32px_0px_#00000007,0px_0.75px_10.02px_0px_#00000009,0px_1.34px_17.87px_0px_#0000000B,0px_2.51px_33.42px_0px_#0000000D,0px_6px_80px_0px_#00000012]">
				<h1>Pro UI (consumer custom styles)</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
					<Field
						name="page"
						className="flex flex-row space-between items-center"
					>
						<Label className="text-[14px] w-1/2">Page name</Label>
						<TextInput className="bg-transparent border border-[var(--rosetta-gray-800)] rounded-[6px] w-1/2 focus-within:border-transparent">
							<TextInput.Control placeholder="Name of new page" />
						</TextInput>
						<ErrorMessage />
					</Field>
					<Field
						name="margin"
						className="flex flex-row space-between items-center"
					>
						<Label className="text-[14px] w-1/2">
							Margin (default, L aligned)
						</Label>
						<TextInput className="bg-transparent border border-[var(--rosetta-gray-800)] rounded-[6px] w-1/2 focus-within:border-transparent">
							<TextInput.Control placeholder="Enter margin" />
							<TextInput.Slot>px</TextInput.Slot>
						</TextInput>
						<ErrorMessage />
					</Field>
					<Field
						name="padding"
						className="flex flex-row space-between items-center"
					>
						<Label className="text-[14px] w-1/2">Padding (R aligned)</Label>
						<TextInput className="bg-transparent border border-[var(--rosetta-gray-800)] rounded-[6px] w-1/2 focus-within:border-transparent">
							<TextInput.Control
								placeholder="Enter padding"
								className="text-right"
							/>
							<TextInput.Slot>px</TextInput.Slot>
						</TextInput>
						<ErrorMessage />
					</Field>
					<Field
						name="visitors"
						className="flex flex-row space-between items-center"
					>
						<Label className="text-[14px] w-1/2">Visitors</Label>
						<Select className="bg-transparent border border-[var(--rosetta-gray-800)] rounded-[6px] w-1/2 focus-within:border-transparent">
							<Select.Control className="w-full">
								<Select.Option>1</Select.Option>
								<Select.Option>2</Select.Option>
								<Select.Option>3</Select.Option>
							</Select.Control>
						</Select>
						<ErrorMessage />
					</Field>
					<Field
						name="admins"
						className="flex flex-row space-between items-center"
					>
						<Label className="text-[14px] w-1/2">Admins</Label>
						<Dropdown className="bg-transparent border border-[var(--rosetta-gray-800)] rounded-[6px] w-1/2 focus-within:border-transparent">
							<Dropdown.Control className="w-full">
								<Dropdown.Option value="john">John</Dropdown.Option>
								<Dropdown.Option value="jake">Jake</Dropdown.Option>
								<Dropdown.Option value="bouby">Bouby</Dropdown.Option>
							</Dropdown.Control>
						</Dropdown>
						<ErrorMessage />
					</Field>
					<Button label="Submit" type="submit" />
				</form>
			</div>
		</main>
	);
}
