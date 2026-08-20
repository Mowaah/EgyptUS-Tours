import React, { useMemo } from "react";
import { AddHotelBookingData } from "../../AddHotelBookingModal";
import RoomSelector from "@/components/dashboard/shared/RoomSelector/RoomSelector";
import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddHotelBookingData;
  onChange: (patch: Partial<AddHotelBookingData>) => void;
  hotelDetail?: any;
  errors?: Record<string, string>;
}

export default function StepBookingDetails({ formData, onChange, hotelDetail }: StepBookingDetailsProps) {
  const groupedRooms = useMemo(() => {
    if (!hotelDetail?.hotelRooms) return {} as Record<string, any>;
    const groups: Record<string, any[]> = {};
    for (const room of hotelDetail.hotelRooms) {
      if (!groups[room.type]) groups[room.type] = [];
      groups[room.type].push(room);
    }
    return groups;
  }, [hotelDetail]);

  const roomGroups = useMemo(() => {
    return Object.entries(groupedRooms).map(([type, rooms]) => {
      let baseRoom = rooms[0];
      if (rooms.length > 1) {
        baseRoom = rooms.reduce((prev: any, curr: any) => prev.pricePerNight < curr.pricePerNight ? prev : curr);
      }
      const options = rooms.map((r: any) => {
        const isBase = r.id === baseRoom.id;
        const diff = r.pricePerNight - baseRoom.pricePerNight;
        return {
          label: r.view,
          value: r.id.toString(),
          price: isBase ? "Included" : (diff > 0 ? `+$${diff}` : `-$${Math.abs(diff)}`),
          isFree: isBase,
        };
      });
      return {
        key: type,
        title: `${baseRoom.typeLabel || type} - ${baseRoom.view}`,
        subtitle: baseRoom.name,
        displayPrice: `$${baseRoom.pricePerNight}`,
        priceUnit: "/ night",
        options,
        defaultOptionValue: baseRoom.id.toString(),
      };
    });
  }, [groupedRooms]);

  const handleCountChange = (type: string, newCount: number, defaultOptionValue: string) => {
    const currentList = formData.roomCustomizations[type] || [];
    let newList = [...currentList];
    if (newCount > currentList.length) {
      for (let i = currentList.length; i < newCount; i++) {
        newList.push(defaultOptionValue);
      }
    } else {
      newList = newList.slice(0, newCount);
    }
    onChange({ 
      rooms: { ...(formData.rooms || {}), [type]: newCount },
      roomCustomizations: { ...(formData.roomCustomizations || {}), [type]: newList }
    });
  };

  const handleCustomizationChange = (type: string, index: number, roomId: string) => {
    const currentList = formData.roomCustomizations[type] || [];
    const newList = [...currentList];
    newList[index] = roomId;
    onChange({ roomCustomizations: { ...(formData.roomCustomizations || {}), [type]: newList } });
  };

  const flatCounts: Record<string, number> = {};
  const flatCustomizations: Record<string, string> = {};
  for (const [type, list] of Object.entries(formData.roomCustomizations || {})) {
    flatCounts[type] = list.length;
    list.forEach((val, i) => { flatCustomizations[`${type}-${i}`] = val; });
  }

  return (
    <div className={styles.container}>
      {hotelDetail ? (
        <RoomSelector
          rooms={roomGroups}
          counts={flatCounts}
          customizations={flatCustomizations}
          onCountChange={handleCountChange}
          onCustomizationChange={handleCustomizationChange}
        />
      ) : (
        <p className={styles.emptyText}>Loading hotel details...</p>
      )}
    </div>
  );
}
