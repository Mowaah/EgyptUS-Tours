import { useState, useRef } from "react";
import { type ContentItem, type ContentGridRef } from "@/components/dashboard/ContentGrid/ContentGrid";

export interface UseContentManagerProps {
  initialData: ContentItem[];
  itemName: string;
}

export function useContentManager({ initialData, itemName }: UseContentManagerProps) {
  const contentGridRef = useRef<ContentGridRef>(null);

  const [data, setData] = useState<ContentItem[]>(initialData);
  const [viewState, setViewState] = useState<{ item: ContentItem; index: number } | null>(null);
  const [editState, setEditState] = useState<ContentItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [saveMode, setSaveMode] = useState<"add" | "edit">("add");
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);

  const handleView = (item: ContentItem, index: number) => setViewState({ item, index });
  
  const handleEdit = (item: ContentItem) => {
    setViewState(null);
    setEditState(item);
  };
  
  const handleAdd = () => setAddOpen(true);

  const handlePublishItem = (item: ContentItem) => {
    setData(prev => prev.map(i => i.id === item.id ? { ...i, status: "Published" } : i));
    contentGridRef.current?.showBanner(`The ${itemName} has been successfully republished`, "success");
  };

  const handleUnpublishItem = (item: ContentItem) => {
    setData(prev => prev.map(i => i.id === item.id ? { ...i, status: "Draft" } : i));
    contentGridRef.current?.showBanner(`The ${itemName} has been moved to draft and unpublished successfully`, "warning");
  };

  const handleDeleteItem = (item: ContentItem) => {
    setDeleteItem(item);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      setData(prev => prev.filter(i => i.id !== deleteItem.id));
      setDeleteItem(null);
      contentGridRef.current?.showBanner(`The ${itemName} has been deleted successfully`, "success");
    }
  };

  const handleSave = (title: string, content: string, published: boolean, mode: "add" | "edit") => {
    const status = published ? "Published" : "Draft";
    const lastUpdated = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    
    if (mode === "add") {
      const newItem: ContentItem = { id: Date.now().toString(), title, content, status, lastUpdated };
      setData(prev => [...prev, newItem]);
    } else if (editState) {
      setData(prev => prev.map(i => i.id === editState.id ? { ...i, title, content, status, lastUpdated } : i));
    }

    setSaveMode(mode);
    setSaveSuccessOpen(true);
  };

  return {
    contentGridRef,
    data,
    viewState,
    setViewState,
    editState,
    setEditState,
    addOpen,
    setAddOpen,
    saveSuccessOpen,
    setSaveSuccessOpen,
    saveMode,
    deleteItem,
    setDeleteItem,
    handleView,
    handleEdit,
    handleAdd,
    handlePublishItem,
    handleUnpublishItem,
    handleDeleteItem,
    confirmDelete,
    handleSave,
  };
}
