"use client";

export function NewsletterForm() {
  return (
    <form className="relative" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        required
      />
      <button
        type="submit"
        className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-lg text-sm font-bold hover:bg-secondary transition-colors"
      >
        Subscribe
      </button>
    </form>
  );
}
