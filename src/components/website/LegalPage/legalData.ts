export interface LegalSection {
  id: string;
  title: string;
  content: string;
}

export interface LegalData {
  title: string;
  subtitle: string;
  sections: LegalSection[];
}
