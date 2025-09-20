import mongoose from 'mongoose';

const trendingProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    originalPrice: Number,
    images: [String],
    primaryImage: String,
    category: String,
    rating: Number,
    reviews: Number,
    theme: String,
    fragrance: String,
    weight: String,
    container: String,
    festival: [String],
    description: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AuraUser' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

const TrendingProduct = mongoose.model('TrendingProduct', trendingProductSchema);

export default TrendingProduct;
