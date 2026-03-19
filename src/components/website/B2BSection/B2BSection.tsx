import { SectionHeader, Button } from "@/components/shared";
import Image from "next/image";
import styles from "./B2BSection.module.scss";

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
              <div className={styles.field}>
                <label className={styles.label}>Company Name</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input
                  type="text"
                  placeholder="Headquarters Country"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Contact Person</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  placeholder="youremail@company.com"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <div className={styles.phoneRow}>
                  <div className={styles.phonePrefix}>
                    <Image src="/images/en.svg" alt="flag" width={20} height={14} />
                    <span>+20</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`${styles.input} ${styles.inputPhone}`}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Website</label>
                <input
                  type="url"
                  placeholder="www.company.com"
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Request Details</label>
                <textarea
                  placeholder="Tell us about your request."
                  className={`${styles.input} ${styles.textarea}`}
                  rows={4}
                />
              </div>

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
