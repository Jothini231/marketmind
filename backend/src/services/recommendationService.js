import Interaction from "../models/Interaction.js";
import Listing from "../models/Listing.js";

const INTERACTION_WEIGHTS = {
  VIEW: 1,
  SAVE: 3,
  CONTACT: 5,
};

export const getRecommendations = async (userId) => {
  const interactions = await Interaction.find({ userId }).populate("listingId");

  const allListings = await Listing.find().sort({ _id: 1 });

  if (interactions.length === 0) {
    return allListings.map((listing) => ({
      ...listing.toObject(),
      recommendationScore: 0,
      matchReasons: [],
    }));
  }

  const categoryScores = {};
  const preferredLocations = new Set();
  const preferredMakes = new Set();
  const preferredPropertyTypes = new Set();
  const interactedListingIds = new Set();
  const viewedListingIds = new Set();

  for (const interaction of interactions) {
    const listing = interaction.listingId;
    if (!listing) continue;

    interactedListingIds.add(listing._id);
    if (interaction.type === "VIEW") {
      viewedListingIds.add(listing._id);
    }

    const weight = INTERACTION_WEIGHTS[interaction.type] || 1;

    categoryScores[listing.category] =
      (categoryScores[listing.category] || 0) + weight;

    if (listing.location) {
      preferredLocations.add(listing.location);
    }

    if (listing.category === "vehicle" && listing.attributes?.make) {
      preferredMakes.add(listing.attributes.make);
    }

    if (listing.category === "property" && listing.attributes?.propertyType) {
      preferredPropertyTypes.add(listing.attributes.propertyType);
    }
  }

  const topCategory = Object.entries(categoryScores).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  let candidateListings = allListings.filter(
    (listing) => !interactedListingIds.has(listing._id)
  );

  if (candidateListings.length < 5) {
    const fallbackListings = allListings.filter(
      (listing) =>
        viewedListingIds.has(listing._id) &&
        !candidateListings.some((c) => c._id === listing._id)
    );
    candidateListings = [...candidateListings, ...fallbackListings];
  }

  const scoredListings = candidateListings.map((listing) => {
    let score = 0;
    const matchReasons = [];

    if (topCategory && listing.category === topCategory) {
      score += 5;
      matchReasons.push(`Category match (${listing.category})`);
    }

    if (listing.location && preferredLocations.has(listing.location)) {
      score += 3;
      matchReasons.push(`Location match (${listing.location})`);
    }

    if (
      listing.category === "vehicle" &&
      listing.attributes?.make &&
      preferredMakes.has(listing.attributes.make)
    ) {
      score += 4;
      matchReasons.push(`Make match (${listing.attributes.make})`);
    }

    if (
      listing.category === "property" &&
      listing.attributes?.propertyType &&
      preferredPropertyTypes.has(listing.attributes.propertyType)
    ) {
      score += 4;
      matchReasons.push(`Property type match (${listing.attributes.propertyType})`);
    }

    return {
      ...listing.toObject(),
      recommendationScore: score,
      matchReasons,
    };
  });

  scoredListings.sort((a, b) => {
    if (b.recommendationScore !== a.recommendationScore) {
      return b.recommendationScore - a.recommendationScore;
    }
    return a._id.localeCompare(b._id, undefined, { numeric: true });
  });

  return scoredListings;
};
