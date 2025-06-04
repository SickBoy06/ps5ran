import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Hash,
  Gamepad2,
  Palette,
  FileText,
  ShieldCheck,
  Receipt,
  Image,
  Save,
  Plus,
  CheckCircle2,
  AlertCircle,
  Package,
  Boxes,
  Cable,
  Headphones,
  Monitor,
} from "lucide-react";

// Shadcn/UI Components with correct imports
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Types
type PS5Model = "Digital Edition" | "Disc Edition" | "Slim" | "Pro";
type PS5Condition = "New" | "Like New" | "Good" | "Fair" | "Poor";
type PS5Color = "Standard White" | "Black" | "Special Edition";
type ControllerCount = "0" | "1" | "2" | "3+";

interface PS5Accessory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface PS5InventoryItem {
  // Step 1: Basic Information
  model: PS5Model | null;
  condition: PS5Condition | null;
  purchasePrice: string;
  purchaseDate: Date | null;
  
  // Step 2: Device Details
  serialNumber: string;
  color: PS5Color | null;
  controllerCount: ControllerCount | null;
  
  // Step 3: Condition Documentation
  hasWarranty: boolean;
  hasReceipt: boolean;
  photoLinks: string;
  
  // Step 4: Accessories & Notes
  accessories: string[];
  notes: string;
}

interface MultistepInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: PS5InventoryItem) => void;
  onSaveAsDraft: (item: PS5InventoryItem) => void;
}

const ACCESSORIES: PS5Accessory[] = [
  { id: "charging-station", name: "Charging Station", icon: <Cable className="h-5 w-5" /> },
  { id: "extra-controller", name: "Extra Controller", icon: <Gamepad2 className="h-5 w-5" /> },
  { id: "headset", name: "Headset", icon: <Headphones className="h-5 w-5" /> },
  { id: "hdmi-cable", name: "HDMI Cable", icon: <Cable className="h-5 w-5" /> },
  { id: "camera", name: "PS5 Camera", icon: <Image className="h-5 w-5" /> },
  { id: "stand", name: "Vertical Stand", icon: <Package className="h-5 w-5" /> },
  { id: "remote", name: "Media Remote", icon: <Monitor className="h-5 w-5" /> },
  { id: "games", name: "Physical Games", icon: <Boxes className="h-5 w-5" /> },
];

const MultistepInventoryModal: React.FC<MultistepInventoryModalProps> = ({
  open,
  onOpenChange,
  onSave,
  onSaveAsDraft
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PS5InventoryItem>({
    // Step 1: Basic Information
    model: null,
    condition: null,
    purchasePrice: "",
    purchaseDate: null,
    
    // Step 2: Device Details
    serialNumber: "",
    color: null,
    controllerCount: null,
    
    // Step 3: Condition Documentation
    hasWarranty: false,
    hasReceipt: false,
    photoLinks: "",
    
    // Step 4: Accessories & Notes
    accessories: [],
    notes: ""
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate estimated profit (simplified example)
  const calculateEstimatedProfit = (): string => {
    if (!formData.model || !formData.condition || !formData.purchasePrice) return "N/A";
    
    const purchasePrice = parseFloat(formData.purchasePrice);
    if (isNaN(purchasePrice)) return "N/A";
    
    // Very simplified profit calculation based on model and condition
    let baseValue = 0;
    switch (formData.model) {
      case "Digital Edition": baseValue = 400; break;
      case "Disc Edition": baseValue = 500; break;
      case "Slim": baseValue = 450; break;
      case "Pro": baseValue = 700; break;
    }
    
    let conditionMultiplier = 1;
    switch (formData.condition) {
      case "New": conditionMultiplier = 1; break;
      case "Like New": conditionMultiplier = 0.9; break;
      case "Good": conditionMultiplier = 0.8; break;
      case "Fair": conditionMultiplier = 0.7; break;
      case "Poor": conditionMultiplier = 0.5; break;
    }
    
    const estimatedValue = baseValue * conditionMultiplier;
    const estimatedProfit = estimatedValue - purchasePrice;
    
    return `$${estimatedProfit.toFixed(2)}`;
  };
  
  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.model) newErrors.model = "Model is required";
        if (!formData.condition) newErrors.condition = "Condition is required";
        if (!formData.purchasePrice) {
          newErrors.purchasePrice = "Purchase price is required";
        } else if (isNaN(parseFloat(formData.purchasePrice))) {
          newErrors.purchasePrice = "Must be a valid number";
        }
        if (!formData.purchaseDate) newErrors.purchaseDate = "Purchase date is required";
        break;
      case 2:
        if (!formData.serialNumber) newErrors.serialNumber = "Serial number is required";
        break;
      // Steps 3 and 4 have no required fields
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.model && formData.condition && formData.purchasePrice && formData.purchaseDate);
      case 2:
        return !!formData.serialNumber;
      case 3:
      case 4:
        return true; // No required fields in steps 3 and 4
      default:
        return false;
    }
  };
  
  const isFormComplete = (): boolean => {
    return isStepValid(1) && isStepValid(2);
  };
  
  // Handler functions
  const handleInputChange = (field: keyof PS5InventoryItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleAccessoryToggle = (accessoryId: string) => {
    setFormData(prev => {
      const updatedAccessories = prev.accessories.includes(accessoryId)
        ? prev.accessories.filter(id => id !== accessoryId)
        : [...prev.accessories, accessoryId];
      
      return { ...prev, accessories: updatedAccessories };
    });
  };
  
  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSave = () => {
    if (isFormComplete()) {
      onSave(formData);
    }
  };
  
  const handleSaveAsDraft = () => {
    onSaveAsDraft(formData);
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    let completedSteps = 0;
    let totalRequiredSteps = 2; // Only steps 1 and 2 have required fields
    
    if (isStepValid(1)) completedSteps++;
    if (isStepValid(2)) completedSteps++;
    
    return (completedSteps / totalRequiredSteps) * 100;
  };

  // Animation variants
  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    })
  };

  // Step titles
  const stepTitles = [
    "Basic Information",
    "Device Details",
    "Condition Documentation",
    "Accessories & Notes"
  ];
  
  // LiveCard component
  const LiveCard = () => {
    return (
      <div className="h-full bg-slate-900 border-r border-slate-700/50 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-slate-100 mb-6">PS5 Summary</h2>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Completion</span>
            <span className="text-sm font-medium text-slate-300">
              {Math.round(calculateProgress())}%
            </span>
          </div>
          <Progress value={calculateProgress()} className="h-2 bg-slate-800" indicatorClassName="bg-blue-500" />
        </div>
        
        <div className="flex-grow flex flex-col space-y-5 text-slate-300">
          {/* Model info */}
          <div className="space-y-1">
            <div className="text-xs text-slate-400">Model</div>
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-400" />
              <span className="font-medium">
                {formData.model || "Not specified"}
              </span>
            </div>
          </div>
          
          {/* Condition info */}
          <div className="space-y-1">
            <div className="text-xs text-slate-400">Condition</div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span className="font-medium">
                {formData.condition || "Not specified"}
              </span>
              {formData.condition && (
                <Badge className={cn(
                  "ml-2",
                  formData.condition === "New" || formData.condition === "Like New" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : formData.condition === "Good" 
                      ? "bg-blue-600 hover:bg-blue-700"
                      : formData.condition === "Fair"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-red-600 hover:bg-red-700"
                )}>
                  {formData.condition}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Price info */}
          <div className="space-y-1">
            <div className="text-xs text-slate-400">Purchase Price</div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-400" />
              <span className="font-medium">
                {formData.purchasePrice ? `$${formData.purchasePrice}` : "Not specified"}
              </span>
            </div>
          </div>
          
          {/* Purchase date */}
          <div className="space-y-1">
            <div className="text-xs text-slate-400">Purchase Date</div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-blue-400" />
              <span className="font-medium">
                {formData.purchaseDate 
                  ? format(formData.purchaseDate, "PPP") 
                  : "Not specified"}
              </span>
            </div>
          </div>
          
          {/* Serial Number (if available) */}
          {formData.serialNumber && (
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Serial Number</div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-blue-400" />
                <span className="font-medium truncate max-w-[180px]">
                  {formData.serialNumber}
                </span>
              </div>
            </div>
          )}
          
          {/* Controller count (if available) */}
          {formData.controllerCount && (
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Controllers</div>
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-4 w-4 text-blue-400" />
                <span className="font-medium">
                  {formData.controllerCount}
                </span>
              </div>
            </div>
          )}
          
          {/* Accessories count (if any selected) */}
          {formData.accessories.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Accessories</div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-400" />
                <span className="font-medium">
                  {formData.accessories.length} item(s)
                </span>
              </div>
            </div>
          )}
          
          {/* Estimated profit */}
          <div className="mt-auto pt-4 border-t border-slate-700/50">
            <div className="text-xs text-slate-400 mb-1">Estimated Profit</div>
            <div className="text-xl font-bold text-green-400">
              {calculateEstimatedProfit()}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Step content components
  const StepOne = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="model" className="text-sm font-medium">
              PS5 Model
              <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-300 border border-red-500/50">
                Required
              </Badge>
            </Label>
            {errors.model && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.model}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {(["Digital Edition", "Disc Edition", "Slim", "Pro"] as PS5Model[]).map((model) => (
              <Button
                key={model}
                type="button"
                variant="outline"
                onClick={() => handleInputChange("model", model)}
                className={cn(
                  "h-16 flex flex-col items-center justify-center space-y-1 border border-slate-700",
                  formData.model === model
                    ? "bg-blue-600/20 border-blue-500 text-blue-100"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                )}
              >
                <Package className={cn(
                  "h-5 w-5",
                  formData.model === model ? "text-blue-300" : "text-slate-400"
                )} />
                <span className="text-xs">{model}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="condition" className="text-sm font-medium">
              Condition
              <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-300 border border-red-500/50">
                Required
              </Badge>
            </Label>
            {errors.condition && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.condition}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
            {(["New", "Like New", "Good", "Fair", "Poor"] as PS5Condition[]).map((condition) => (
              <Button
                key={condition}
                type="button"
                variant="outline"
                onClick={() => handleInputChange("condition", condition)}
                className={cn(
                  "border border-slate-700",
                  formData.condition === condition
                    ? "bg-blue-600/20 border-blue-500 text-blue-100"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                )}
              >
                {condition}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="purchasePrice" className="text-sm font-medium">
              Purchase Price
              <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-300 border border-red-500/50">
                Required
              </Badge>
            </Label>
            {errors.purchasePrice && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.purchasePrice}
              </span>
            )}
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              id="purchasePrice"
              type="text"
              placeholder="0.00"
              value={formData.purchasePrice}
              onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
              className={cn(
                "pl-9 bg-slate-800 border-slate-700 text-slate-100",
                errors.purchasePrice ? "border-red-500" : "focus:border-blue-500"
              )}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="purchaseDate" className="text-sm font-medium">
              Purchase Date
              <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-300 border border-red-500/50">
                Required
              </Badge>
            </Label>
            {errors.purchaseDate && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.purchaseDate}
              </span>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-slate-100",
                  !formData.purchaseDate && "text-slate-400",
                  errors.purchaseDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.purchaseDate ? format(formData.purchaseDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
              <Calendar
                mode="single"
                selected={formData.purchaseDate || undefined}
                onSelect={(date) => handleInputChange("purchaseDate", date)}
                initialFocus
                className="bg-slate-800 text-slate-100"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };
  
  const StepTwo = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="serialNumber" className="text-sm font-medium">
              Serial Number
              <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-300 border border-red-500/50">
                Required
              </Badge>
            </Label>
            {errors.serialNumber && (
              <span className="text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.serialNumber}
              </span>
            )}
          </div>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              id="serialNumber"
              type="text"
              placeholder="Enter serial number"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange("serialNumber", e.target.value)}
              className={cn(
                "pl-9 bg-slate-800 border-slate-700 text-slate-100",
                errors.serialNumber ? "border-red-500" : "focus:border-blue-500"
              )}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="color" className="text-sm font-medium">
            Color/Edition
          </Label>
          <Select
            value={formData.color || ""}
            onValueChange={(value) => handleInputChange("color", value as PS5Color)}
          >
            <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-slate-100">
              <SelectValue placeholder="Select color/edition" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
              <SelectItem value="Standard White">Standard White</SelectItem>
              <SelectItem value="Black">Black</SelectItem>
              <SelectItem value="Special Edition">Special Edition</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="controllerCount" className="text-sm font-medium">
            Number of Controllers
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {(["0", "1", "2", "3+"] as ControllerCount[]).map((count) => (
              <Button
                key={count}
                type="button"
                variant="outline"
                onClick={() => handleInputChange("controllerCount", count)}
                className={cn(
                  "border border-slate-700",
                  formData.controllerCount === count
                    ? "bg-blue-600/20 border-blue-500 text-blue-100"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                )}
              >
                <Gamepad2 className="h-4 w-4 mr-2" />
                {count}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const StepThree = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hasWarranty" className="text-sm font-medium">
            Warranty Available
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="hasWarranty"
              checked={formData.hasWarranty}
              onCheckedChange={(checked) => handleInputChange("hasWarranty", checked)}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor="hasWarranty" className="text-slate-300">
              {formData.hasWarranty ? "Yes" : "No"}
            </Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hasReceipt" className="text-sm font-medium">
            Purchase Receipt Available
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="hasReceipt"
              checked={formData.hasReceipt}
              onCheckedChange={(checked) => handleInputChange("hasReceipt", checked)}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor="hasReceipt" className="text-slate-300">
              {formData.hasReceipt ? "Yes" : "No"}
            </Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="photoLinks" className="text-sm font-medium">
            Photo Links
          </Label>
          <div className="relative">
            <Image className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
            <Textarea
              id="photoLinks"
              placeholder="Add links to photos (one per line)"
              value={formData.photoLinks}
              onChange={(e) => handleInputChange("photoLinks", e.target.value)}
              className="min-h-[120px] pl-9 bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-500"
            />
          </div>
          <p className="text-xs text-slate-400">
            Add links to photos showing the condition of the console
          </p>
        </div>
      </div>
    );
  };
  
  const StepFour = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Included Accessories
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {ACCESSORIES.map((accessory) => {
              const isSelected = formData.accessories.includes(accessory.id);
              return (
                <motion.div
                  key={accessory.id}
                  whileTap={{ scale: 0.97 }}
                  animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    onClick={() => handleAccessoryToggle(accessory.id)}
                    className={cn(
                      "flex items-center p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-blue-100"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "mr-3 p-2 rounded-full",
                      isSelected ? "bg-blue-500/20" : "bg-slate-700"
                    )}>
                      {accessory.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-medium">{accessory.name}</div>
                    </div>
                    <Checkbox
                      checked={isSelected}
                      className="data-[state=checked]:bg-blue-500 border-slate-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Additional Notes
          </Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
            <Textarea
              id="notes"
              placeholder="Add any additional information about this PS5"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="min-h-[120px] pl-9 bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  };
  
  // Step content wrapper
  const StepContent = ({ step, direction }: { step: number, direction: number }) => {
    return (
      <motion.div
        key={step}
        custom={direction}
        variants={slideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-100">
            {stepTitles[step - 1]}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {step === 1 && "Enter the basic information about the PS5."}
            {step === 2 && "Provide details about the device."}
            {step === 3 && "Document the condition and proof of purchase."}
            {step === 4 && "Add any accessories and additional notes."}
          </p>
        </div>
        
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
        {step === 4 && <StepFour />}
      </motion.div>
    );
  };
  
  // Track animation direction
  const [direction, setDirection] = useState(0);
  
  // Update direction when step changes
  useEffect(() => {
    setDirection(0);
  }, []);
  
  const goToNextStep = () => {
    setDirection(1);
    handleNext();
  };
  
  const goToPrevStep = () => {
    setDirection(-1);
    handleBack();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-2 border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl max-h-[85vh] p-0 flex overflow-hidden">
        {/* Left column - Live Card */}
        <div className="w-1/3 h-[85vh] overflow-auto">
          <LiveCard />
        </div>
        
        {/* Right column - Form Steps */}
        <div className="w-2/3 flex flex-col h-[85vh]">
          <div className="flex-grow p-6 overflow-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <StepContent key={currentStep} step={currentStep} direction={direction} />
            </AnimatePresence>
          </div>
          
          {/* Step navigation */}
          <div className="border-t border-slate-700/50 p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={goToPrevStep}
                    className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex space-x-2">
                {currentStep === 4 && (
                  <Button
                    variant="outline"
                    onClick={handleSaveAsDraft}
                    className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                )}
                
                {currentStep < 4 ? (
                  <Button
                    onClick={goToNextStep}
                    disabled={!isStepValid(currentStep)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next to {stepTitles[currentStep]}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    disabled={!isFormComplete()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Inventory Item
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultistepInventoryModal;
