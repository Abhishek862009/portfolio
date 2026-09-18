"use client";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-2xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">
        Get in touch
      </h2>

      <p className="mt-3 text-slate">
        Have a project, opportunity, or just want to say hi?
      </p>

      <form
        action="https://formspree.io/f/xyezyqlw"
        method="POST"
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;

          fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
              Accept: "application/json",
            },
          })
            .then((response) => {
              if (response.ok) {
                form.reset();
                alert("Message sent successfully!");
              } else {
                alert("Something went wrong. Please try again.");
              }
            })
            .catch(() => {
              alert("Something went wrong. Please try again.");
            });
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          pattern="[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)"
          title="Please enter a valid Gmail, Yahoo, or Outlook email address"
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile number"
          required
          pattern="[6-9][0-9]{9}"
          maxLength={10}
          inputMode="numeric"
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        <textarea
          name="message"
          placeholder="Message"
          rows={5}
          required
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        <button
          type="submit"
          className="rounded-full bg-glow px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
        >
          Send message
        </button>
      </form>
    </section>
  );
}
