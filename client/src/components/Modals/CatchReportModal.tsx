import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Fish, MapPin, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CatchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

interface CatchReportForm {
  species: string;
  quantity: number;
  length?: number;
  weight?: number;
  latitude: string;
  longitude: string;
  notes?: string;
}

export default function CatchReportModal({ isOpen, onClose, onSubmit }: CatchReportModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<CatchReportForm>({
    species: "",
    quantity: 1,
    length: undefined,
    weight: undefined,
    latitude: "",
    longitude: "",
    notes: ""
  });

  const submitMutation = useMutation({
    mutationFn: async (data: CatchReportForm) => {
      return apiRequest("POST", "/api/catch-reports", {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        userId: 1 // Mock user ID for now
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Catch report submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/catch-reports"] });
      handleClose();
      onSubmit();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit catch report.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: keyof CatchReportForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          }));
          toast({
            title: "Location captured",
            description: "GPS coordinates have been filled in.",
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to retrieve your current location.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "GPS Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.species || !formData.latitude || !formData.longitude) {
      toast({
        title: "Missing Information",
        description: "Please fill in species and location.",
        variant: "destructive",
      });
      return;
    }

    submitMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      species: "",
      quantity: 1,
      length: undefined,
      weight: undefined,
      latitude: "",
      longitude: "",
      notes: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Fish className="w-5 h-5 text-ocean-500 mr-2" />
            Report Catch
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="species">Species *</Label>
              <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seer Fish">Seer Fish</SelectItem>
                  <SelectItem value="Pomfret">Pomfret</SelectItem>
                  <SelectItem value="Red Snapper">Red Snapper</SelectItem>
                  <SelectItem value="Pearl Spot">Pearl Spot</SelectItem>
                  <SelectItem value="Kingfish">Kingfish</SelectItem>
                  <SelectItem value="Tuna">Tuna</SelectItem>
                  <SelectItem value="Sailfish">Sailfish</SelectItem>
                  <SelectItem value="Marlin">Marlin</SelectItem>
                  <SelectItem value="Mackerel">Mackerel</SelectItem>
                  <SelectItem value="Sardine">Sardine</SelectItem>
                  <SelectItem value="Anchovy">Anchovy</SelectItem>
                  <SelectItem value="Flying Fish">Flying Fish</SelectItem>
                  <SelectItem value="Mullet">Mullet</SelectItem>
                  <SelectItem value="Hilsa">Hilsa</SelectItem>
                  <SelectItem value="Grouper">Grouper</SelectItem>
                  <SelectItem value="Barracuda">Barracuda</SelectItem>
                  <SelectItem value="Shark">Shark</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Length (inches)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                min="0"
                value={formData.length || ""}
                onChange={(e) => handleInputChange("length", e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
            
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight || ""}
                onChange={(e) => handleInputChange("weight", e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>
          
          <div>
            <Label>Location *</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Latitude"
                value={formData.latitude}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                required
              />
              <Input
                placeholder="Longitude"
                value={formData.longitude}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGetCurrentLocation}
                className="flex-shrink-0"
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Bait used, conditions, etc."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-ocean-500 hover:bg-ocean-600"
              disabled={submitMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {submitMutation.isPending ? "Saving..." : "Save Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
