import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 text-center text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="text-primary font-medium hover:underline">
            Club<span className="text-pink-500">OS</span>
          </Link>{" "}
          · All rights reserved.
        </p>
      </div>
    </footer>
  );
}
