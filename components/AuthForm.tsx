"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/actions/auth.action";
import {
  Eye,
  EyeOff,
  Check,
  Circle,
  Loader2,
} from "lucide-react";

type FormType = "sign-in" | "sign-up";

interface AuthFormProps {
  type: FormType;
}

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: type === "sign-up" 
      ? z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
      : z.string().min(1, "Password is required"),
  });
};

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const requirements = [
    { id: "length", text: "At least 8 characters", met: password.length >= 8 },
    { id: "uppercase", text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { id: "lowercase", text: "One lowercase letter", met: /[a-z]/.test(password) },
    { id: "number", text: "One number", met: /[0-9]/.test(password) },
    { id: "special", text: "One special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const allRequirementsMet = requirements.every(req => req.met);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        if (!allRequirementsMet) {
          form.setError("root", { message: "Please meet all password requirements" });
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          form.setError("root", { message: result.message });
          return;
        }

        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          form.setError("root", { message: "Sign in Failed. Please try again." });
          return;
        }

        await signIn({
          email,
          idToken,
        });

        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      form.setError("root", { message: error.message || "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const idToken = await user.getIdToken();
        if (idToken && user.email) {
          await signIn({
            email: user.email,
            idToken: idToken,
          });
          router.push("/");
        } else {
          form.setError("root", { message: "Google Sign-In Failed: Could not get token or email." });
        }
      } else {
        form.setError("root", { message: "Google Sign-In Failed: Could not get user." });
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        form.setError("root", { message: "Sign-in popup closed." });
      } else {
        form.setError("root", { message: error.message || "Google Sign-In Failed" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl shadow-xl p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
          CogniVue
        </h1>
        <h2 className="text-lg text-muted-foreground text-center leading-relaxed">
          {type === "sign-in" ? "Sign in to your account" : "Create a new account"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (type === "sign-up") {
                          setPassword(e.target.value);
                          setShowPasswordRequirements(true);
                        }
                      }}
                      onFocus={() => {
                        if (type === "sign-up") {
                          setShowPasswordRequirements(true);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                {type === "sign-up" && showPasswordRequirements && (
                  <div className="mt-2 space-y-1 text-sm">
                    {requirements.map((req) => (
                      <div
                        key={req.id}
                        className={`flex items-center gap-2 ${
                          req.met ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        {req.met ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                        {req.text}
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full btn-primary mt-6" 
            disabled={isLoading || (type === "sign-up" && !allRequirementsMet)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {type === "sign-in" ? "Signing in..." : "Creating account..."}
              </div>
            ) : type === "sign-in" ? (
              "Sign In"
            ) : (
              "Create an Account"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-zinc-900 px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full flex items-center gap-2 btn-secondary"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Image src="/google.svg" alt="Google Icon" width={20} height={20} />
            Sign In with Google
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={type === "sign-in" ? "/sign-up" : "/sign-in"}
          className="text-primary hover:underline font-semibold"
        >
          {type === "sign-in" ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
}

export default AuthForm;
