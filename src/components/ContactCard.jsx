export default function ContactCard() {
  return (
    <section className="w-full bg-accent py-16 px-6 text-[color:var(--color-text-primary)]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="rounded-2xl bg-[color:var(--color-secondary-light)] p-8 shadow-lg shadow-black/20">
          <h2 className="text-3xl font-bold text-[color:var(--color-primary-light)]">
            Contact Us
          </h2>
          <p className="mt-3 text-[color:var(--color-accent-muted)]">
            We’d love to hear from you. Send a message and we’ll reply as soon
            as possible.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-sm text-[color:var(--color-text-light)]">
                Email
              </p>
              <p className="text-[color:var(--color-accent)]">
              He779@hotmail.com
              </p>
            </div>
            <div>
              <p className="text-sm text-[color:var(--color-text-light)]">
                Phone
              </p>
              <p className="text-[color:var(--color-accent)]">
                +971 509 590 444
              </p>
            </div>
            <div>
              <p className="text-sm text-[color:var(--color-text-light)]">
                Location
              </p>
              <p className="text-[color:var(--color-accent)]">Muscat, Oman</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-[color:var(--color-accent)] p-8 shadow-lg shadow-black/20 border border-[color:var(--color-accent-muted)]">
          <form className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-medium text-[color:var(--color-text-primary)]">
                Full Name
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-[color:var(--color-accent-muted)] bg-[color:var(--color-accent)] px-4 py-3 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-light)] outline-none shadow-sm hover:border-[color:var(--color-text-light)] focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--color-text-primary)]">
                Email
              </label>
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-[color:var(--color-accent-muted)] bg-[color:var(--color-accent)] px-4 py-3 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-light)] outline-none shadow-sm hover:border-[color:var(--color-text-light)] focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--color-text-primary)]">
                Subject
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-[color:var(--color-accent-muted)] bg-[color:var(--color-accent)] px-4 py-3 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-light)] outline-none shadow-sm hover:border-[color:var(--color-text-light)] focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/20"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--color-text-primary)]">
                Message
              </label>
              <textarea
                rows={5}
                className="mt-2 w-full rounded-xl border border-[color:var(--color-accent-muted)] bg-[color:var(--color-accent)] px-4 py-3 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-light)] outline-none shadow-sm hover:border-[color:var(--color-text-light)] focus:border-[color:var(--color-primary)] focus:ring-4 focus:ring-[color:var(--color-primary)]/20 resize-y"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="button"
              className="group relative mt-2 inline-flex items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-6 py-3 font-semibold text-[color:var(--color-accent)] shadow-md shadow-black/10 transition-all duration-300 hover:bg-[color:var(--color-primary-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
            >
              <span className="relative z-10">Send Message</span>
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.25),rgba(255,255,255,0))]"></span>
              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[color:var(--color-accent)] group-hover:scale-125 transition-transform duration-300"></span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
