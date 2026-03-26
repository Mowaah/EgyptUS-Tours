import { SectionHeader, Button, FormField, PhonePrefixSelect } from "@/components/shared";
import Image from "next/image";
import CountrySelect from "./CountrySelect";
import styles from "./B2BSection.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";

export default function B2BSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <SectionHeader
              label="B2B"
              heading="Global Partners, Local Experts"
              align="left"
              headingMaxWidth="400px"
              headingClassName={styles.largeHeading}
            />
          </div>

          <div className={styles.topRight}>
            <p className={styles.topDescription}>
              Unlock Egypt for your clients. We offer seamless ground handling and
              curated travel management for universities and corporate partners,
              ensuring world-class service and authentic cultural immersion for
              every group
            </p>
            <Button
              variant="outline"
              href="/b2b"
              icon={
                <Image
                  src="/images/arrow-right-blue.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              }
            >
              Partner With Us
            </Button>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.photoCollage}>
              <div className={styles.decoration}>
                <Image
                  src="/images/trips2.svg"
                  alt=""
                  width={22}
                  height={22}
                  className={styles.plane}
                />
                <Image
                  src="/images/dotted-line2.svg"
                  alt=""
                  width={293}
                  height={354}
                  className={styles.dottedLine}
                />
              </div>

              <div className={`${styles.photo} ${styles.photoTop}`}>
                <Image
                  src="/images/b2b/b2b.jpg"
                  alt="Partner destination"
                  fill
                  sizes="400px"
                  className={styles.photoImg}
                />
              </div>
              <div className={`${styles.photo} ${styles.photoMid}`}>
                <Image
                  src="/images/b2b/b2b2.jpg"
                  alt="Partner destination"
                  fill
                  sizes="400px"
                  className={styles.photoImg}
                />
              </div>
              <div className={`${styles.photo} ${styles.photoBot}`}>
                <Image
                  src="/images/b2b/b2b3.jpg"
                  alt="Partner destination"
                  fill
                  sizes="400px"
                  className={styles.photoImg}
                />
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.formCard}>
              <FormField label="Company Name" type="text" placeholder="Company Name" />

              <div className={formStyles.field}>
                <label className={formStyles.fieldLabel}>Country</label>
                <CountrySelect />
              </div>

              <FormField label="Contact Person" type="text" placeholder="Full Name" />

              <FormField label="Email Address" type="email" placeholder="youremail@company.com" />

              <div className={formStyles.field}>
                <label className={formStyles.fieldLabel}>Phone Number</label>
                <div className={styles.phoneRow}>
                  <PhonePrefixSelect />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`${formStyles.input} ${styles.inputPhone}`}
                  />
                </div>
              </div>

              <FormField label="Website" type="url" placeholder="www.company.com" />

              <FormField 
                label="Request Details" 
                isTextarea 
                placeholder="Tell us about your request." 
                rows={4} 
              />

              <Button
                variant="secondary"
                fullWidth
                icon={
                  <Image
                    src="/images/arrow-right.svg"
                    alt=""
                    width={24}
                    height={24}
                    style={{ marginTop: "2px" }}
                  />
                }
              >
                Request Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
