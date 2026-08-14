import { useState, useRef, useCallback } from "react";
import useSWR from "swr";
import { type ContentItem, type ContentGridRef } from "@/components/dashboard/ContentGrid/ContentGrid";

export interface UseContentManagerProps {
  itemName: string;
  fetchData: () => Promise<ContentItem[]>;
  createItem: (title: string, content: string, published: boolean) => Promise<ContentItem>;
  updateItem: (id: string, title: string, content: string, published: boolean) => Promise<ContentItem>;
  deleteItemApi: (id: string) => Promise<void>;
  updateStatus: (id: string, published: boolean) => Promise<void>;
  dependencies?: any[];
}

export function useContentManager({ 
  itemName, 
  fetchData, 
  createItem, 
  updateItem, 
  deleteItemApi, 
  updateStatus,
  dependencies = []
}: UseContentManagerProps) {
  const contentGridRef = useRef<ContentGridRef>(null);

  const { data: swrData, isLoading: loading, mutate } = useSWR<ContentItem[]>(
    [`content-manager-${itemName}`, ...dependencies],
    fetchData
  );

  const data = swrData || [];

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

  const handlePublishItem = async (item: ContentItem) => {
    try {
      mutate(data.map(i => i.id === item.id ? { ...i, status: "Published" } : i), false);
      await updateStatus(item.id, true);
      mutate();
      contentGridRef.current?.showBanner(`The ${itemName} has been successfully republished`, "success");
    } catch (err) {
      console.error(`Failed to publish ${itemName}:`, err);
    }
  };

  const handleUnpublishItem = async (item: ContentItem) => {
    try {
      mutate(data.map(i => i.id === item.id ? { ...i, status: "Unpublished" } : i), false);
      await updateStatus(item.id, false);
      mutate();
      contentGridRef.current?.showBanner(`The ${itemName} has been unpublished successfully`, "warning");
    } catch (err) {
      console.error(`Failed to unpublish ${itemName}:`, err);
    }
  };

  const handleDeleteItem = (item: ContentItem) => {
    setDeleteItem(item);
  };

  const confirmDelete = async () => {
    if (deleteItem) {
      try {
        mutate(data.filter(i => i.id !== deleteItem.id), false);
        await deleteItemApi(deleteItem.id);
        mutate();
        setDeleteItem(null);
        contentGridRef.current?.showBanner(`The ${itemName} has been deleted successfully`, "success");
      } catch (err) {
        console.error(`Failed to delete ${itemName}:`, err);
      }
    }
  };

  const handleSave = async (title: string, content: string, published: boolean, mode: "add" | "edit") => {
    try {
      if (mode === "add") {
        const newItem = await createItem(title, content, published);
        mutate([...data, newItem], false);
      } else if (editState) {
        const updatedItem = await updateItem(editState.id, title, content, published);
        mutate(data.map(i => i.id === editState.id ? updatedItem : i), false);
      }

      mutate();
      setSaveMode(mode);
      setSaveSuccessOpen(true);
    } catch (err) {
      console.error(`Failed to save ${itemName}:`, err);
    }
  };

  return {
    contentGridRef,
    data,
    loading,
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
