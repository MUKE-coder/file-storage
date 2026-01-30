/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Package, Image, Plus } from "lucide-react";
import { CategoryCreateData } from "@/lib/api/categories/schema";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/lib/api/categories";
import { Dropzone, FileWithMetadata } from "@/components/ui/dropzone";

export default function CategoryForm() {
  const [open, setOpen] = useState(false);
  const [s3Files, setS3Files] = useState<FileWithMetadata[]>([]);
  console.log(s3Files);
  const form = useForm<CategoryCreateData>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      isFeatured: false,
      isActive: true,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate and refetch category query
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category Created successfully");
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: CategoryCreateData) => {
    const fileData = s3Files[0];
    // url?size=&&key=&&p=aws&&name=
    const image = `${fileData.publicUrl}?size=${fileData.file.size}&&key=${fileData.key}&&p=${fileData.provider}&&name=${fileData.file.name}&&type=${fileData.file.type}`;

    const category = {
      name: data.name,
      description: data.description,
      image: image,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
    };

    console.log(category);
    mutation.mutate(category);
  };

  const onCancel = (): void => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="light-pill">
          <Plus className="h-5 w-5 mr-2" />
          Add New Category
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className=" pt-6 px-6 rounded-t-lg">
          <div className="flex items-center justify-between ">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Package className="h-5 w-5" />
                Create New Category
              </DialogTitle>
              <DialogDescription className=" mt-1">
                Fill in the details below to create your category listing
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className=" max-h-[calc(90vh-140px)]">
          <div className=" px-6 pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Category name is required",
                    minLength: {
                      value: 3,
                      message: "Category name must be at least 3 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Category Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">
                        Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product..."
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-16 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {field.value?.length || 0}/500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image URL */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormLabel className="text-gray-700 font-semibold flex items-center gap-1">
                        <Image className="h-4 w-4" />
                        Image URL *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="">
                  <Dropzone
                    provider="cloudflare"
                    variant="compact"
                    maxFiles={1}
                    maxSize={1024 * 1024 * 50} // 50MB
                    onFilesChange={setS3Files}
                  />
                </div>

                {/*Active and featured*/}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel className="text-gray-700 font-semibold">
                          Is Featured
                        </FormLabel>
                        <div className="flex items-center space-x-2 h-10">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label className="text-sm text-gray-600">
                            {field.value ? "Yes" : "No"}
                          </Label>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-end">
                        <FormLabel className="text-gray-700 font-semibold">
                          Is Active
                        </FormLabel>
                        <div className="flex items-center space-x-2 h-10">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label className="text-sm text-gray-600">
                            {field.value ? "Yes" : "No"}
                          </Label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    className="flex-1"
                    variant={"default"}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Processing" : " Create Category"}
                  </Button>

                  <Button
                    type="button"
                    onClick={onCancel}
                    disabled={mutation.isPending}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
