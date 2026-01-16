"use client";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useForm } from "react-hook-form";
import React from "react";


export default function Home() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");

  useCopilotReadable({
    description: "The user information",
    value: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
  });

  useCopilotAction({
    name: "fillUserInformation",
    description: "Fill out the user information",
    parameters: [
      {
        name: "firstName",
        type: "string",
        required: true,
        description: "The first name of the person",
      },
      {
        name: "lastName",
        type: "string",
        required: true,
        description: "The last name of the person",
      },
      {
        name: "email",
        type: "string",
        required: true,
        description: "The email address of the person",
      },
    ],
    handler: async (action) => {
      console.log(action);
      setFirstName(action.firstName);
      setLastName(action.lastName);
      setEmail(action.email);
    },
  });

  // Render the ContactInfo component and wait for the user's response.
  useCopilotAction({
    name: "createOrderInformation",
    description: "Get the order information from the user",
    renderAndWaitForResponse: ({ status, respond }) => {
      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const item = formData.get("item");
        respond?.("User has submitted the order for " + item + ".");
      };
      return (
        <form onSubmit={handleSubmit}>
          <label htmlFor="item">Which item would you like to order?</label>
          <input
            type="text"
            placeholder="item"
            name="item"
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <label htmlFor="quantity">How many?</label>
          <input
            type="number"
            placeholder="quantity"
            name="quantity"
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <br />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      );
    },
  });

  return (
    <CopilotSidebar
      defaultOpen={true}
      instructions={
        "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
      }
      labels={{
        title: "Sidebar Assistant",
        initial: "How can I help you today?",
      }}
    >
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <ul className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <li>Ask to create an order (I want to order)</li>
            <li>
              Say you are someone (firsname lastname) with email xxxx it should
              fill the form
            </li>
            <li>update the form and ask who you are.</li>
          </ul>
          <hr className="border-zinc-300 my-8 w-full" />
          <form className="space-y-6">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First Name"
              className="w-full rounded border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last Name"
              className="w-full rounded border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email Address"
              className="w-full rounded border border-zinc-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
              <button
                type="reset"
                className="rounded bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset
              </button>
            </div>
          </form>
        </main>
      </div>
    </CopilotSidebar>
  );
}
