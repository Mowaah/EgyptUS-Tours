import { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./CreateCategoryModal.module.scss";

interface CategoryItem {
  label: string;
  value: string;
}

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onCreate: (categoryName: string) => Promise<void> | void;
  onDelete: (categoryValue: string) => void;
}

export default function CreateCategoryModal({ isOpen, onClose, categories, onCreate, onDelete }: CreateCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen || !mounted) return null;

  const handleCreate = async () => {
    if (categoryName.trim()) {
      setIsCreating(true);
      try {
        await onCreate(categoryName.trim());
        setCategoryName("");
        onClose();
      } catch (err) {
        console.error("Failed to create category", err);
      } finally {
        setIsCreating(false);
      }
    }
  };

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal} role="dialog" aria-modal="true">
        <ModalHeader
          title="Create New Category"
          subtitle="Add a new article category to organize and manage article content"
          iconSrc="/images/dashboard/create-new-category.svg"
          onClose={onClose}
        />
        <div className={styles.content}>
          <DashboardField
            label="Category Name"
            placeholder="Enter a unique category name for your article content."
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className={styles.hintText}>
            <Image src="/images/information-fill2.svg" alt="" width={16} height={16} aria-hidden="true" />
            <span>Add one or more categories for better organization.</span>
          </div>

          {categories.length > 0 && (
            <div className={styles.categoryList}>
              {categories.map((cat) => (
                <div key={cat.value} className={styles.categoryItem}>
                  <span className={styles.categoryName}>{cat.label}</span>
                  <button type="button" className={styles.deleteBtn} onClick={() => onDelete(cat.value)}>
                    <Image src="/images/dashboard/delete.svg" alt="Delete" width={20} height={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel={isCreating ? "Creating..." : "Create Category"}
          primaryOnClick={handleCreate}
          primaryDisabled={!categoryName.trim() || isCreating}
        />
      </div>
    </div>,
    document.body
  );
}
