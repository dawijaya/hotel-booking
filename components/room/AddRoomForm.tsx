"use client";

import * as z from "zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul harus terdiri dari minimal 3 karakter." }),
  description: z
    .string()
    .min(10, { message: "Deskripsi harus terdiri dari minimal 10 karakter." }),
  bedCount: z.coerce
    .number()
    .min(1, { message: "Jumlah tempat tidur diperlukan" }),
  guestCount: z.coerce.number().min(1, { message: "Jumlah tamu diperlukan" }),
  bathroomCount: z.coerce
    .number()
    .min(1, { message: "Jumlah kamar mandi diperlukan" }),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.string().min(1, { message: "Gambar diperlukan" }),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1, { message: "Harga kamar diperlukan" }),
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

const AddRoomForm = ({ hotel, room, handleDialogueOpen }: AddRoomFormProps) => {
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

  const handleRemoveImage = async () => {
    const imageKey = image?.substring(image.lastIndexOf("/") + 1);
    if (!imageKey) return;

    try {
      await axios.post("/api/uploadthing/delete", { imageKey });
      setImage("");
      form.setValue("image", "", { shouldValidate: true });
      toast({ variant: "success", description: "Gambar berhasil dihapus!" });
    } catch (error) {
      console.error("Error menghapus gambar:", error);
      toast({ variant: "destructive", description: "Gagal menghapus gambar" });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      handleImageUpload(file);
    }
  };

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
        description: "🎉 Gambar berhasil diunggah!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Gagal mengunggah gambar!",
      });
      console.error("Error mengunggah gambar:", error);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (hotel && room) {
      axios
        .patch(`/api/room/${room.id}`, values)
        .then(() => {
          toast({
            variant: "success",
            description: "🎉 Kamar berhasil diperbarui",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Terjadi kesalahan!",
          });
          setIsLoading(false);
        });
    } else {
      if (!hotel) return;
      axios
        .post("/api/room", { ...values, hotelId: hotel.id })
        .then(() => {
          toast({
            variant: "success",
            description: "🎉 Kamar berhasil dibuat",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            description: "Terjadi kesalahan!",
          });
          setIsLoading(false);
        });
    }
  }

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2 ">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Kamar *</FormLabel>
                <FormDescription>Berikan nama untuk kamar ini</FormDescription>
                <FormControl>
                  <Input placeholder="Double hotel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Kolom isian lainnya... */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Description *</FormLabel>
                <FormDescription>
                  Is there anything special about this room?
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Have a beautiful view of the ocean while in this room!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Choose Room Amenities</FormLabel>
            <FormDescription>
              What makes this room a good choice?
            </FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { name: "roomService", label: "24hrs Room Services" },
                { name: "TV", label: "TV" },
                { name: "balcony", label: "Balcony" },
                { name: "freeWifi", label: "Free Wifi" },
                { name: "cityView", label: "City View" },
                { name: "oceanView", label: "Ocean View" },
                { name: "forestView", label: "Forest View" },
                { name: "mountainView", label: "Mountain View" },
                { name: "airCondition", label: "Air Conditioned" },
                { name: "soundProofed", label: "Sound Proofed" },
              ].map((amenity) => (
                <FormField
                  key={amenity.name}
                  control={form.control}
                  name={amenity.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>{amenity.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3 mt-3">
                <FormLabel>Upload an Image *</FormLabel>
                <FormDescription>
                  Choose an image that will showcase your room nicely
                </FormDescription>
                <FormControl>
                  {image ? (
                    <div className="relative max-w-[400px] mt-4">
                      <Image
                        src={image}
                        alt="Hotel Image"
                        width={400}
                        height={300}
                        className="object-contain"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleRemoveImage}>
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center border-2 p-12 border-dashed border-primary/50 rounded mt-4">
                      <input type="file" onChange={handleImageChange} />
                    </div>
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Price in USD *</FormLabel>
                    <FormDescription>
                      State the price for staying in this room for 24hrs
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Count *</FormLabel>
                    <FormDescription>
                      How many beds are available in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Count *</FormLabel>
                    <FormDescription>
                      How many guests are allowed in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms Count *</FormLabel>
                    <FormDescription>
                      How many bathrooms are in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breakfast Price in USD *</FormLabel>
                    <FormDescription>
                      State the price for breakfast.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King Beds *</FormLabel>
                    <FormDescription>
                      How many king beds are available in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queenBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen Beds *</FormLabel>
                    <FormDescription>
                      How many queen beds are in this room.
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-4 pb-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" /> Processing
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />{" "}
                  {room ? "Update Room" : "Create Room"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
