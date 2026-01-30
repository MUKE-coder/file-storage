import {
  CategoryCreateData,
  DashboardCategory,
  FormCategory,
} from "./schema";

export async function getHomeCategories(): Promise<DashboardCategory[]> {
  const response = await fetch("/api/v1/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function getFormCategories(): Promise<FormCategory[]> {
  const response = await fetch("/api/v1/categories/form-categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function deleteCategoryById(id: string) {
  const response = await fetch(`/api/v1/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
  return response.json();
}

export async function createCategory(data: CategoryCreateData) {
  const response = await fetch("/api/v1/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}
