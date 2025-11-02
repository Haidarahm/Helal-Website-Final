export default function Footer() {
  return (
    <footer className="bg-secondary-light text-accent ">
      <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-light">
          © {new Date().getFullYear()} Helal Aljaberi. All rights reserved.
        </p>
        <div className="text-sm text-text-light">
          Sponsored By{" "}
          <a
            href="https://tikit.ae"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-light transition-colors font-semibold"
          >
            Tikit Agency
          </a>
        </div>
      </div>
    </footer>
  );
}
