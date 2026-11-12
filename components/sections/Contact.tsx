"use client";

import Link from "next/link";

import { T } from "@/components/i18n/T";
import { useT } from "@/components/i18n/LanguageProvider";
import { NOTICE_VERSION, PRIVACY_EMAIL, PRIVACY_PATH } from "@/lib/privacy";

export function Contact() {
  const t = useT();

  return (
    <section id="contact" className="mx-auto max-w-2xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">
        <T en="Get in touch" hi="संपर्क करें" />
      </h2>

      <p className="mt-3 text-slate">
        <T en="Have a project, opportunity, or just want to say hi?" hi="कोई प्रोजेक्ट, मौक़ा, या बस हाय कहना है?" />
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
                alert(t("Message sent successfully!", "संदेश सफलतापूर्वक भेज दिया गया!"));
              } else {
                alert(t("Something went wrong. Please try again.", "कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।"));
              }
            })
            .catch(() => {
              alert(t("Something went wrong. Please try again.", "कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।"));
            });
        }}
      >
        <input
          type="text"
          name="name"
          placeholder={t("Name", "नाम")}
          required
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-base sm:text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder={t("Email", "ईमेल")}
          required
          pattern="[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)"
          title={t("Please enter a valid Gmail, Yahoo, or Outlook email address", "कृपया सही Gmail, Yahoo या Outlook ईमेल पता डालें")}
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-base sm:text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        <input
          type="tel"
          name="mobile"
          placeholder={t("Mobile number", "मोबाइल नंबर")}
          required
          pattern="[6-9][0-9]{9}"
          maxLength={10}
          inputMode="numeric"
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-base sm:text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        <textarea
          name="message"
          placeholder={t("Message", "संदेश")}
          rows={5}
          required
          className="w-full rounded-lg border border-hairline bg-ink/40 px-4 py-3 text-base sm:text-sm text-frost placeholder:text-slate focus:border-glow focus:outline-none"
        />

        {/* Which version of the Privacy Notice the visitor saw. Arrives with the message, so
            there is a record of what each person agreed to (lib/privacy.ts). */}
        <input type="hidden" name="notice_version" value={NOTICE_VERSION} />

        <p className="text-sm leading-relaxed text-slate">
          <T
            en="Your name, email, mobile number and message are used only to reply to you. They are delivered through the form service Formspree to my email. "
            hi="आपका नाम, ईमेल, मोबाइल नंबर और संदेश सिर्फ़ आपको जवाब देने के लिए इस्तेमाल होते हैं। ये फ़ॉर्म सेवा Formspree के ज़रिए मेरे ईमेल तक पहुँचते हैं। "
          />
          <Link href={PRIVACY_PATH} className="text-glow underline underline-offset-4">
            <T en="Read the Privacy Notice" hi="गोपनीयता सूचना पढ़ें" />
          </Link>
          <T
            en={`. You can withdraw consent, or ask me to correct or delete your data, any time at ${PRIVACY_EMAIL}.`}
            hi={`। आप कभी भी ${PRIVACY_EMAIL} पर सहमति वापस ले सकते हैं, या डेटा सुधारने/हटाने को कह सकते हैं।`}
          />
        </p>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-slate">
          <input
            type="checkbox"
            name="age_18_plus"
            value="Yes"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-glow"
          />
          <span>{t("I am 18 years of age or older.", "मेरी उम्र 18 वर्ष या उससे अधिक है।")}</span>
        </label>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-slate">
          <input
            type="checkbox"
            name="consent"
            value="Agreed to the Privacy Notice"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-glow"
          />
          <span>
            {t(
              "I agree that my name, email, mobile number and message may be used to reply to my enquiry, as described in the Privacy Notice.",
              "मैं सहमत हूँ कि मेरा नाम, ईमेल, मोबाइल नंबर और संदेश मेरी पूछताछ का जवाब देने के लिए, गोपनीयता सूचना में बताए अनुसार, इस्तेमाल किए जा सकते हैं।"
            )}
          </span>
        </label>

        <button
          type="submit"
          className="rounded-full bg-glow px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
        >
          <T en="Contact me" hi="मुझसे संपर्क करें" />
        </button>
      </form>
    </section>
  );
}
