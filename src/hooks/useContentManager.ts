import { useState, useRef, useEffect, useCallback } from "react";
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

  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<{ item: ContentItem; index: number } | null>(null);
  const [editState, setEditState] = useState<ContentItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);
  const [saveMode, setSaveMode] = useState<"add" | "edit">("add");
  const [deleteItem, setDeleteItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const items = await fetchData();
        if (isMounted) setData(items);
      } catch (err) {
        console.error(`Failed to fetch ${itemName}s:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const handleView = (item: ContentItem, index: number) => setViewState({ item, index });
  
  const handleEdit = (item: ContentItem) => {
    setViewState(null);
    setEditState(item);
  };
  
  const handleAdd = () => setAddOpen(true);

  const handlePublishItem = async (item: ContentItem) => {
    try {
      await updateStatus(item.id, true);
      setData(prev => prev.map(i => i.id === item.id ? { ...i, status: "Published" } : i));
      contentGridRef.current?.showBanner(`The ${itemName} has been successfully republished`, "success");
    } catch (err) {
      console.error(`Failed to publish ${itemName}:`, err);
    }
  };

  const handleUnpublishItem = async (item: ContentItem) => {
    try {
      await updateStatus(item.id, false);
      setData(prev => prev.map(i => i.id === item.id ? { ...i, status: "Unpublished" } : i));
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
        await deleteItemApi(deleteItem.id);
        setData(prev => prev.filter(i => i.id !== deleteItem.id));
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
        setData(prev => [...prev, newItem]);
      } else if (editState) {
        const updatedItem = await updateItem(editState.id, title, content, published);
        setData(prev => prev.map(i => i.id === editState.id ? updatedItem : i));
      }

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
