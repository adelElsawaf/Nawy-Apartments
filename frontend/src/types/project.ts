export type Project = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string | null;
};

export type GetAllProjectsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type GetAllProjectsResponse = {
  data: Project[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};
