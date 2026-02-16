import { createAsyncThunk } from '@reduxjs/toolkit';
import { recipeApi } from '../../services/recipeApi';

export const searchRecipes = createAsyncThunk(
  'recipe/search',
  async (query: string) => {
    return await recipeApi.searchByName(query);
  }
);

export const searchByCategory = createAsyncThunk(
  'recipe/searchByCategory',
  async (category: string) => {
    return await recipeApi.searchByCategory(category);
  }
);

export const searchByArea = createAsyncThunk(
  'recipe/searchByArea',
  async (area: string) => {
    return await recipeApi.searchByArea(area);
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipe/fetchById',
  async (id: string) => {
    return await recipeApi.getById(id);
  }
);
