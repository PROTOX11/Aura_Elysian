import FeaturedCollection from "../models/FeaturedCollection.js";

export const getFeaturedCollections = async (req, res) => {
  const collections = await FeaturedCollection.find().sort({ createdAt: -1 });
  res.status(200).json(collections);
};

export const createFeaturedCollection = async (req, res) => {
  const collection = await FeaturedCollection.create(req.body);
  res.status(201).json(collection);
};
