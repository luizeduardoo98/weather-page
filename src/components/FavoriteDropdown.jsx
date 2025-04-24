import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function FavoriteDropdown() {
  const [favorites, setFavorites] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    try {
      const storedFavorites = localStorage.getItem("favoriteCities");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("favorite cities parse error:", error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const handleFavoritesUpdated = (event) => {
      try {
        if (event.detail && event.detail.favorites) {
          setFavorites(event.detail.favorites);
        } else {
          const storedFavorites = localStorage.getItem("favoriteCities");
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error("Failed to update favorites:", error);
      }
    };

    document.addEventListener("favoritesUpdated", handleFavoritesUpdated);

    return () => {
      document.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, []);

  const handleCitySelect = (city) => {
    window.location.href = `/?lat=${city.latitude}&lon=${
      city.longitude
    }&city=${encodeURIComponent(city.address)}`;
  };

  if (!isMounted) {
    return (
      <Button variant="outline" className="w-full">
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border border-gray-300 px-4 py-1 rounded-md w-full cursor-pointer">
        <span className="whitespace-nowrap">Favorite Cities</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        {favorites && favorites.length > 0 ? (
          favorites.map((city, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleCitySelect(city)}
              className="cursor-pointer"
            >
              {city.address}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No favorite cities</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
