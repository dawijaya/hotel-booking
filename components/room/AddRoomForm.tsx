"use client";

import * as z from "zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
  bedCount: z.coerce.number().min(1),
  guestCount: z.coerce.number().min(1),
  bathroomCount: z.coerce.number().min(1),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.string().min(1),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1),
  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
});

const AddRoomForm = ({
  hotel,
  room,
  handleDialogueOpen,
}: {
  hotel?: Hotel & { rooms: Room[] };
  room?: Room;
  handleDialogueOpen: () => void;
}) => {
  const [image, setImage] = useState<string | undefined>(room?.image);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,
      roomService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airCondition: false,
      soundProofed: false,
    },
  });

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      setImage(data.secure_url);
      form.setValue("image", data.secure_url, { shouldValidate: true });
      toast({
        variant: "success",
        description: "🎉 Image uploaded successfully!",
      });
    } catch (error) {
      toast({ variant: "destructive", description: "Image upload failed!" });
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const method = room ? axios.patch : axios.post;
    const url = room ? `/api/room/${room.id}` : "/api/room";
    method(url, { ...values, hotelId: hotel?.id })
      .then(() => {
        toast({
          variant: "success",
          description: room ? "🎉 Room Updated" : "🎉 Room Created",
        });
        router.refresh();
        handleDialogueOpen();
      })
      .catch(() => {
        toast({ variant: "destructive", description: "Something went wrong!" });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Double hotel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Description *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Room description here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roomPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Price *</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="breakFastPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breakfast Price</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Boolean fields */}
          {[
            { name: "roomService", label: "Room Service" },
            { name: "TV", label: "TV" },
            { name: "balcony", label: "Balcony" },
            { name: "freeWifi", label: "Free Wifi" },
            { name: "cityView", label: "City View" },
            { name: "oceanView", label: "Ocean View" },
            { name: "forestView", label: "Forest View" },
            { name: "mountainView", label: "Mountain View" },
            { name: "airCondition", label: "Air Condition" },
            { name: "soundProofed", label: "Sound Proofed" },
          ].map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof z.infer<typeof formSchema>}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true} // Pastikan field.value adalah boolean
                      onCheckedChange={(checked) => field.onChange(checked)} // Update field.value dengan boolean
                    />
                  </FormControl>
                  <FormLabel>{label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4" />
            ) : (
              <Pencil className="mr-2 h-4 w-4" />
            )}
            {room ? "Update Room" : "Create Room"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
