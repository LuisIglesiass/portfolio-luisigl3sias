export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 md:px-12 py-20">
      <div className="container max-w-3xl">
        <a href="/" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
          ← Back to home
        </a>

        <h1 className="font-display text-4xl md:text-5xl mt-8 mb-10">Privacy Policy</h1>

        <div className="font-mono text-sm text-muted-foreground leading-relaxed space-y-8">
          <p>Last updated: September 2026</p>

          <section>
            <h2 className="font-display text-xl text-foreground mb-2">What this site is</h2>
            <p>
              This is a static personal portfolio for Luis Iglesias. It has no
              login, no user accounts, and no forms that submit data to a
              server — the "Get in touch" links open your own email client
              (<code>mailto:</code>) instead of sending anything through this
              site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-2">
              Data this site collects
            </h2>
            <p>
              None, directly. This site does not use cookies, analytics, or
              any tracking scripts of its own, and does not store any data
              you enter — there's nowhere on the page to enter data in the
              first place.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-2">
              Third parties
            </h2>
            <p>
              Fonts (Fraunces, JetBrains Mono) are loaded from Google Fonts
              (<code>fonts.googleapis.com</code>, <code>fonts.gstatic.com</code>),
              which receives your IP address and browser details as part of
              that request, per Google's own privacy policy. The site is
              hosted on Vercel, which processes standard server logs
              (IP address, request path, timestamp) to operate the hosting
              infrastructure. Neither is used by this site to track you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-2">
              Your rights
            </h2>
            <p>
              Since this site doesn't collect or store personal data itself,
              there's nothing to request, correct, or delete on my end. If
              you email me directly, that message is handled like any other
              personal email — kept only as long as needed to reply, not
              shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground mb-2">Contact</h2>
            <p>
              Questions about this policy:{" "}
              <a href="mailto:lluis.igl3sias@gmail.com" className="text-primary hover:underline">
                lluis.igl3sias@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
