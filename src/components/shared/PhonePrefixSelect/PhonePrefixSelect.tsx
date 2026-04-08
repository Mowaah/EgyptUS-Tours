"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import styles from "./PhonePrefixSelect.module.scss";

const PHONE_CODES = [
  // Prioritized
  { code: "us", dial: "+1", name: "United States" },
  { code: "gb", dial: "+44", name: "United Kingdom" },
  { code: "ca", dial: "+1", name: "Canada" },
  { code: "au", dial: "+61", name: "Australia" },

  { code: "af", dial: "+93", name: "Afghanistan" },
  { code: "al", dial: "+355", name: "Albania" },
  { code: "dz", dial: "+213", name: "Algeria" },
  { code: "as", dial: "+1", name: "American Samoa" },
  { code: "ad", dial: "+376", name: "Andorra" },
  { code: "ao", dial: "+244", name: "Angola" },
  { code: "ai", dial: "+1", name: "Anguilla" },
  { code: "ag", dial: "+1", name: "Antigua and Barbuda" },
  { code: "ar", dial: "+54", name: "Argentina" },
  { code: "am", dial: "+374", name: "Armenia" },
  { code: "aw", dial: "+297", name: "Aruba" },
  { code: "at", dial: "+43", name: "Austria" },
  { code: "az", dial: "+994", name: "Azerbaijan" },
  { code: "bs", dial: "+1", name: "Bahamas" },
  { code: "bh", dial: "+973", name: "Bahrain" },
  { code: "bd", dial: "+880", name: "Bangladesh" },
  { code: "bb", dial: "+1", name: "Barbados" },
  { code: "by", dial: "+375", name: "Belarus" },
  { code: "be", dial: "+32", name: "Belgium" },
  { code: "bz", dial: "+501", name: "Belize" },
  { code: "bj", dial: "+229", name: "Benin" },
  { code: "bm", dial: "+1", name: "Bermuda" },
  { code: "bt", dial: "+975", name: "Bhutan" },
  { code: "bo", dial: "+591", name: "Bolivia" },
  { code: "ba", dial: "+387", name: "Bosnia and Herzegovina" },
  { code: "bw", dial: "+267", name: "Botswana" },
  { code: "br", dial: "+55", name: "Brazil" },
  { code: "io", dial: "+246", name: "British Indian Ocean Territory" },
  { code: "bg", dial: "+359", name: "Bulgaria" },
  { code: "bf", dial: "+226", name: "Burkina Faso" },
  { code: "bi", dial: "+257", name: "Burundi" },
  { code: "cv", dial: "+238", name: "Cabo Verde" },
  { code: "kh", dial: "+855", name: "Cambodia" },
  { code: "cm", dial: "+237", name: "Cameroon" },
  { code: "ky", dial: "+1", name: "Cayman Islands" },
  { code: "cf", dial: "+236", name: "Central African Republic" },
  { code: "td", dial: "+235", name: "Chad" },
  { code: "cl", dial: "+56", name: "Chile" },
  { code: "cn", dial: "+86", name: "China" },
  { code: "co", dial: "+57", name: "Colombia" },
  { code: "km", dial: "+269", name: "Comoros" },
  { code: "cg", dial: "+242", name: "Congo" },
  { code: "cd", dial: "+243", name: "Congo (DRC)" },
  { code: "cr", dial: "+506", name: "Costa Rica" },
  { code: "hr", dial: "+385", name: "Croatia" },
  { code: "cu", dial: "+53", name: "Cuba" },
  { code: "cy", dial: "+357", name: "Cyprus" },
  { code: "cz", dial: "+420", name: "Czechia" },
  { code: "dk", dial: "+45", name: "Denmark" },
  { code: "dj", dial: "+253", name: "Djibouti" },
  { code: "dm", dial: "+1", name: "Dominica" },
  { code: "do", dial: "+1", name: "Dominican Republic" },
  { code: "ec", dial: "+593", name: "Ecuador" },
  { code: "eg", dial: "+20", name: "Egypt" },
  { code: "sv", dial: "+503", name: "El Salvador" },
  { code: "gq", dial: "+240", name: "Equatorial Guinea" },
  { code: "er", dial: "+291", name: "Eritrea" },
  { code: "ee", dial: "+372", name: "Estonia" },
  { code: "sz", dial: "+268", name: "Eswatini" },
  { code: "et", dial: "+251", name: "Ethiopia" },
  { code: "fj", dial: "+679", name: "Fiji" },
  { code: "fi", dial: "+358", name: "Finland" },
  { code: "fr", dial: "+33", name: "France" },
  { code: "ga", dial: "+241", name: "Gabon" },
  { code: "gm", dial: "+220", name: "Gambia" },
  { code: "ge", dial: "+995", name: "Georgia" },
  { code: "de", dial: "+49", name: "Germany" },
  { code: "gh", dial: "+233", name: "Ghana" },
  { code: "gr", dial: "+30", name: "Greece" },
  { code: "gd", dial: "+1", name: "Grenada" },
  { code: "gt", dial: "+502", name: "Guatemala" },
  { code: "gn", dial: "+224", name: "Guinea" },
  { code: "gw", dial: "+245", name: "Guinea-Bissau" },
  { code: "gy", dial: "+592", name: "Guyana" },
  { code: "ht", dial: "+509", name: "Haiti" },
  { code: "hn", dial: "+504", name: "Honduras" },
  { code: "hk", dial: "+852", name: "Hong Kong" },
  { code: "hu", dial: "+36", name: "Hungary" },
  { code: "is", dial: "+354", name: "Iceland" },
  { code: "in", dial: "+91", name: "India" },
  { code: "id", dial: "+62", name: "Indonesia" },
  { code: "ir", dial: "+98", name: "Iran" },
  { code: "iq", dial: "+964", name: "Iraq" },
  { code: "ie", dial: "+353", name: "Ireland" },
  { code: "it", dial: "+39", name: "Italy" },
  { code: "jm", dial: "+1", name: "Jamaica" },
  { code: "jp", dial: "+81", name: "Japan" },
  { code: "jo", dial: "+962", name: "Jordan" },
  { code: "kz", dial: "+7", name: "Kazakhstan" },
  { code: "ke", dial: "+254", name: "Kenya" },
  { code: "ki", dial: "+686", name: "Kiribati" },
  { code: "kp", dial: "+850", name: "North Korea" },
  { code: "kr", dial: "+82", name: "South Korea" },
  { code: "kw", dial: "+965", name: "Kuwait" },
  { code: "kg", dial: "+996", name: "Kyrgyzstan" },
  { code: "la", dial: "+856", name: "Laos" },
  { code: "lv", dial: "+371", name: "Latvia" },
  { code: "lb", dial: "+961", name: "Lebanon" },
  { code: "ls", dial: "+266", name: "Lesotho" },
  { code: "lr", dial: "+231", name: "Liberia" },
  { code: "ly", dial: "+218", name: "Libya" },
  { code: "li", dial: "+423", name: "Liechtenstein" },
  { code: "lt", dial: "+370", name: "Lithuania" },
  { code: "lu", dial: "+352", name: "Luxembourg" },
  { code: "mo", dial: "+853", name: "Macau" },
  { code: "mg", dial: "+261", name: "Madagascar" },
  { code: "mw", dial: "+265", name: "Malawi" },
  { code: "my", dial: "+60", name: "Malaysia" },
  { code: "mv", dial: "+960", name: "Maldives" },
  { code: "ml", dial: "+223", name: "Mali" },
  { code: "mt", dial: "+356", name: "Malta" },
  { code: "mh", dial: "+692", name: "Marshall Islands" },
  { code: "mr", dial: "+222", name: "Mauritania" },
  { code: "mu", dial: "+230", name: "Mauritius" },
  { code: "mx", dial: "+52", name: "Mexico" },
  { code: "fm", dial: "+691", name: "Micronesia" },
  { code: "md", dial: "+373", name: "Moldova" },
  { code: "mc", dial: "+377", name: "Monaco" },
  { code: "mn", dial: "+976", name: "Mongolia" },
  { code: "me", dial: "+382", name: "Montenegro" },
  { code: "ma", dial: "+212", name: "Morocco" },
  { code: "mz", dial: "+258", name: "Mozambique" },
  { code: "mm", dial: "+95", name: "Myanmar" },
  { code: "na", dial: "+264", name: "Namibia" },
  { code: "nr", dial: "+674", name: "Nauru" },
  { code: "np", dial: "+977", name: "Nepal" },
  { code: "nl", dial: "+31", name: "Netherlands" },
  { code: "nz", dial: "+64", name: "New Zealand" },
  { code: "ni", dial: "+505", name: "Nicaragua" },
  { code: "ne", dial: "+227", name: "Niger" },
  { code: "ng", dial: "+234", name: "Nigeria" },
  { code: "mk", dial: "+389", name: "North Macedonia" },
  { code: "no", dial: "+47", name: "Norway" },
  { code: "om", dial: "+968", name: "Oman" },
  { code: "pk", dial: "+92", name: "Pakistan" },
  { code: "pw", dial: "+680", name: "Palau" },
  { code: "pa", dial: "+507", name: "Panama" },
  { code: "pg", dial: "+675", name: "Papua New Guinea" },
  { code: "py", dial: "+595", name: "Paraguay" },
  { code: "pe", dial: "+51", name: "Peru" },
  { code: "ph", dial: "+63", name: "Philippines" },
  { code: "pl", dial: "+48", name: "Poland" },
  { code: "pt", dial: "+351", name: "Portugal" },
  { code: "pr", dial: "+1", name: "Puerto Rico" },
  { code: "qa", dial: "+974", name: "Qatar" },
  { code: "ro", dial: "+40", name: "Romania" },
  { code: "ru", dial: "+7", name: "Russia" },
  { code: "rw", dial: "+250", name: "Rwanda" },
  { code: "ws", dial: "+685", name: "Samoa" },
  { code: "sm", dial: "+378", name: "San Marino" },
  { code: "st", dial: "+239", name: "Sao Tome and Principe" },
  { code: "sa", dial: "+966", name: "Saudi Arabia" },
  { code: "sn", dial: "+221", name: "Senegal" },
  { code: "rs", dial: "+381", name: "Serbia" },
  { code: "sc", dial: "+248", name: "Seychelles" },
  { code: "sl", dial: "+232", name: "Sierra Leone" },
  { code: "sg", dial: "+65", name: "Singapore" },
  { code: "sk", dial: "+421", name: "Slovakia" },
  { code: "si", dial: "+386", name: "Slovenia" },
  { code: "sb", dial: "+677", name: "Solomon Islands" },
  { code: "so", dial: "+252", name: "Somalia" },
  { code: "za", dial: "+27", name: "South Africa" },
  { code: "ss", dial: "+211", name: "South Sudan" },
  { code: "es", dial: "+34", name: "Spain" },
  { code: "lk", dial: "+94", name: "Sri Lanka" },
  { code: "sd", dial: "+249", name: "Sudan" },
  { code: "sr", dial: "+597", name: "Suriname" },
  { code: "se", dial: "+46", name: "Sweden" },
  { code: "ch", dial: "+41", name: "Switzerland" },
  { code: "sy", dial: "+963", name: "Syria" },
  { code: "tw", dial: "+886", name: "Taiwan" },
  { code: "tj", dial: "+992", name: "Tajikistan" },
  { code: "tz", dial: "+255", name: "Tanzania" },
  { code: "th", dial: "+66", name: "Thailand" },
  { code: "tl", dial: "+670", name: "Timor-Leste" },
  { code: "tg", dial: "+228", name: "Togo" },
  { code: "to", dial: "+676", name: "Tonga" },
  { code: "tt", dial: "+1", name: "Trinidad and Tobago" },
  { code: "tn", dial: "+216", name: "Tunisia" },
  { code: "tr", dial: "+90", name: "Turkey" },
  { code: "tm", dial: "+993", name: "Turkmenistan" },
  { code: "tv", dial: "+688", name: "Tuvalu" },
  { code: "ug", dial: "+256", name: "Uganda" },
  { code: "ua", dial: "+380", name: "Ukraine" },
  { code: "ae", dial: "+971", name: "United Arab Emirates" },
  { code: "uy", dial: "+598", name: "Uruguay" },
  { code: "uz", dial: "+998", name: "Uzbekistan" },
  { code: "vu", dial: "+678", name: "Vanuatu" },
  { code: "va", dial: "+379", name: "Vatican City" },
  { code: "ve", dial: "+58", name: "Venezuela" },
  { code: "vn", dial: "+84", name: "Vietnam" },
  { code: "ye", dial: "+967", name: "Yemen" },
  { code: "zm", dial: "+260", name: "Zambia" },
  { code: "zw", dial: "+263", name: "Zimbabwe" },
];

interface PhonePrefixSelectProps {
  phoneValue?: string;
  onPhoneChange?: (val: string) => void;
}

export default function PhonePrefixSelect({ phoneValue = "", onPhoneChange }: PhonePrefixSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(PHONE_CODES[0]);
  const [typedChars, setTypedChars] = useState("");
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to auto-detect the user's country based on IP (great UX)
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_code) {
          const matchedCountry = PHONE_CODES.find(
            (c) => c.code.toLowerCase() === data.country_code.toLowerCase()
          );
          if (matchedCountry && !phoneValue) {
            setSelected(matchedCountry);
            if (onPhoneChange) onPhoneChange(`${matchedCountry.dial} `);
          }
        }
      })
      .catch((err) => console.error("Could not auto-detect country code", err));
  }, []); // Only run once on mount

  // Watch the user typing! If they type +44 manually, swap the flag to UK naturally
  useEffect(() => {
    if (!phoneValue) return;

    // Sort array so longest dial codes (+351) match before shorter ones (+3)
    const match = [...PHONE_CODES]
      .sort((a, b) => b.dial.length - a.dial.length)
      .find(c => phoneValue.startsWith(c.dial));

    if (match && match.code !== selected.code) {
      setSelected(match);
    }
  }, [phoneValue, selected.code]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Only capture single letter keys
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);

      const newChars = (typedChars + e.key).toLowerCase();
      setTypedChars(newChars);

      const matchedIndex = PHONE_CODES.findIndex(c => c.name.toLowerCase().startsWith(newChars));
      if (matchedIndex !== -1) {
        if (!isOpen) {
          const newMatch = PHONE_CODES[matchedIndex];
          setSelected(newMatch);
          if (onPhoneChange) {
            const currentPrefix = [...PHONE_CODES]
              .sort((a, b) => b.dial.length - a.dial.length)
              .find(code => phoneValue.startsWith(code.dial));

            if (currentPrefix) {
              onPhoneChange(phoneValue.replace(currentPrefix.dial, newMatch.dial));
            } else {
              onPhoneChange(`${newMatch.dial} ${phoneValue}`);
            }
          }
        } else {
          // If the menu is open, smoothly scroll down to it and focus it
          const matchedBtn = scrollAreaRef.current?.children[matchedIndex] as HTMLButtonElement;
          if (matchedBtn) {
            matchedBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
            matchedBtn.focus();
          }
        }
      }

      // Reset the buffer after 700ms of typing inactivity
      typeTimeoutRef.current = setTimeout(() => setTypedChars(""), 700);
    }
  };

  return (
    <div className={styles.wrapper} ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={`https://flagcdn.com/w40/${selected.code}.png`}
          alt={selected.code}
          className={styles.flag}
        />
        <img
          src="/images/arrows/chevron-down2.svg"
          alt=""
          width={20}
          height={20}
          className={styles.chevron}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.scrollArea} ref={scrollAreaRef}>
            {PHONE_CODES.map((c, i) => (
              <button
                key={`${c.code}-${i}`}
                type="button"
                className={styles.option}
                onClick={() => {
                  setSelected(c);
                  setIsOpen(false);
                  if (onPhoneChange) {
                    const currentPrefix = [...PHONE_CODES]
                      .sort((a, b) => b.dial.length - a.dial.length)
                      .find(code => phoneValue.startsWith(code.dial));

                    if (currentPrefix) {
                      onPhoneChange(phoneValue.replace(currentPrefix.dial, c.dial));
                    } else {
                      // Keep whatever letters they typed, just prepend the dial code
                      onPhoneChange(`${c.dial} ${phoneValue}`);
                    }
                  }
                }}
              >
                <img
                  src={`https://flagcdn.com/w40/${c.code}.png`}
                  alt={c.name}
                  className={styles.flag}
                />
                <span className={styles.dialOptionSpan}>{c.dial}</span>
                <span className={styles.nameOptionSpan}>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
