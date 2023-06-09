import { LoadingDots } from "@/components/LoadingDots";
import { fetcher } from "@/lib/fetch";
import { useCurrentUser } from "@/lib/user";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Menu, Transition } from "@headlessui/react";
import { UserAvatar } from "@/components/UserAvatar";
import clsx from "clsx";
import { toastStyle } from "@/tools/toast-style";
import {
  ChevronDownIcon,
  RocketIcon,
  SignOutIcon,
  SlidersIcon,
  VersionsIcon,
} from "@primer/octicons-react";

const CheckUser = ({ user }: any) => {
  const [status, setStatus]: any = useState();

  const verify = useCallback(async () => {
    try {
      setStatus("loading");

      await fetcher("/api/user/email/verify", { method: "POST" });

      toast.success(
        "An email has been sent to your mailbox. Follow the instruction to verify your email.",
        toastStyle
      );

      setStatus("success");
    } catch (e: any) {
      toast.error(e.message, toastStyle);

      setStatus(undefined);
    }
  }, []);

  if (process.env.NEXT_PUBLIC_FULL != "true") return <></>;

  return (
    <div
      className={clsx(
        "ml-4 p-2.5 rounded-lg flex items-center md:ml-6",
        !user.emailVerified
          ? "bg-yellow-50 border-yellow-200"
          : "bg-green-50 border-green-200"
      )}
    >
      <div
        className={clsx(
          "mr-2 border-r text-sm",
          !user.emailVerified ? "border-yellow-200" : "border-green-200"
        )}
      >
        <a
          className={clsx(
            "mr-2",
            !user.emailVerified ? "text-yellow-600" : "text-green-600"
          )}
        >
          {!user.emailVerified
            ? "Not Verified"
            : !user.githubApiToken &&
              !user.railwayApiToken &&
              !user.renderApiToken
            ? "You need to setup your API tokens"
            : "Everything is okay"}
        </a>
      </div>
      {!user.emailVerified ? (
        <a
          className="text-yellow-600 text-sm cursor-pointer flex items-center justify-center"
          onClick={verify}
        >
          {status == "loading" ? (
            <LoadingDots className="flex items-center justify-center" />
          ) : (
            "Verify"
          )}
        </a>
      ) : (
        <a className="text-sm">👍</a>
      )}
    </div>
  );
};

const Layout = ({ children, title }: any) => {
  const { data, error, mutate } = useCurrentUser();
  const loading = !data && !error;
  const router = useRouter();

  const PushToSignIn = () => {
    useEffect(() => {
      if (!data?.user) {
        router.push("/sign-in");
      }
    }, []);

    return <></>;
  };

  const onSignOut = useCallback(async () => {
    try {
      await fetcher("/api/auth", {
        method: "DELETE",
      });

      toast.success("You have been signed out", toastStyle);

      mutate({ user: null });
    } catch (e: any) {
      toast.error(e.message, toastStyle);
    }
  }, [mutate]);

  return (
    <>
      {loading ? (
        <LoadingDots className="fixed inset-0 flex items-center justify-center" />
      ) : data?.user ? (
        <div className="min-h-screen bg">
          <div className="flex flex-col flex-1">
            <div className="relative flex-shrink-0 flex h-16">
              <div className="flex-1 px-4 flex justify-between sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                <button type="button" className="text-gray-400 outline-none">
                  <img
                    className="h-11 w-11 pt-1 mx-auto"
                    src="https://cdn-botway.deno.dev/icon.svg"
                    alt="Botway Logo"
                    onClick={() => router.push("/")}
                  />
                </button>
                <div className="flex-1 flex"></div>
                <div>
                  <div className="ml-4 flex items-center md:ml-6 pt-3">
                    <CheckUser user={data.user} />
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs rounded-full flex transition items-center text-sm outline-none focus:ring-gray-800 p-2 lg:rounded-md">
                          <UserAvatar data={data.user.email} size={25} />

                          <ChevronDownIcon
                            className="flex-shrink-0 pl-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right bg absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 border border-gray-800 ring-1 ring-gray-800 ring-opacity-5 focus:outline-none z-10">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={"/settings"}
                                className={clsx(
                                  active ? "bg-secondary" : "",
                                  "transition block mx-2 my-1 rounded-md cursor-pointer px-4 py-2 text-sm text-gray-400"
                                )}
                              >
                                <SlidersIcon size={18} className="pr-1" />{" "}
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={"https://botway.deno.dev/docs/ui"}
                                className={clsx(
                                  active ? "bg-secondary" : "",
                                  "transition block mx-2 my-1 rounded-md cursor-pointer px-4 py-2 text-sm text-gray-400"
                                )}
                                target="_blank"
                              >
                                <RocketIcon size={18} className="pr-1" /> Docs
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={"https://botway.deno.dev/changelog"}
                                className={clsx(
                                  active ? "bg-secondary" : "",
                                  "transition block mx-2 my-1 rounded-md cursor-pointer px-4 py-2 text-sm text-gray-400"
                                )}
                                target="_blank"
                              >
                                <VersionsIcon size={18} className="pr-1" />{" "}
                                Changelog
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={onSignOut}
                                className={clsx(
                                  active ? "bg-secondary" : "",
                                  "transition text-red-600 block mx-2 my-1 rounded-md cursor-pointer px-4 py-2 text-sm"
                                )}
                              >
                                <SignOutIcon size={18} className="pr-1" /> Sign
                                Out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 pb-8">
            <div>
              <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
                <div className="pt-6 pb-2 md:flex md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center">
                          <h1 className="text-xl font-bold leading-7 text-gray-500 sm:leading-9 sm:truncate">
                            {title}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      ) : (
        <PushToSignIn />
      )}
    </>
  );
};

export default Layout;
