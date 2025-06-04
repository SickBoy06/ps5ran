import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Package, Gamepad2, DollarSign, Calendar, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import MultistepInventoryModal from "@/components/MultistepInventoryModal";
import { cn } from "@/lib/utils";

// Types
interface PS5InventoryItem {
  // Step 1: Basic Information
  model: string | null;
  condition: string | null;
  purchasePrice: string;
  purchaseDate: Date | null;
  
  // Step 2: Device Details
  serialNumber: string;
  color: string | null;
  controllerCount: string | null;
  
  // Step 3: Condition Documentation
  hasWarranty: boolean;
  hasReceipt: boolean;
  photoLinks: string;
  
  // Step 4: Accessories & Notes
  accessories: string[];
  notes: string;
}

function App() {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<PS5InventoryItem[]>([]);
  const [draftItems, setDraftItems] = useState<PS5InventoryItem[]>([]);
  
  // Event handlers
  const handleSaveItem = (item: PS5InventoryItem) => {
    setInventoryItems(prev => [...prev, item]);
    setIsModalOpen(false);
  };
  
  const handleSaveAsDraft = (item: PS5InventoryItem) => {
    setDraftItems(prev => [...prev, item]);
    setIsModalOpen(false);
  };
  
  const handleDeleteItem = (index: number) => {
    setInventoryItems(prev => prev.filter((_, i) => i !== index));
  };
  
  // Helper function to get condition badge color
  const getConditionBadgeClass = (condition: string | null) => {
    if (!condition) return "bg-slate-600";
    
    switch (condition) {
      case "New":
      case "Like New":
        return "bg-green-600 hover:bg-green-700";
      case "Good":
        return "bg-blue-600 hover:bg-blue-700";
      case "Fair":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "Poor":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700/50">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">PS5 Reseller Dashboard</h1>
                <p className="text-slate-400 text-sm">Manage your PlayStation 5 inventory</p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New PS5
              </Button>
            </motion.div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        {/* Inventory Section */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            Your PS5 Inventory
            {inventoryItems.length > 0 && (
              <Badge className="ml-3 bg-blue-600">{inventoryItems.length} items</Badge>
            )}
          </h2>
          
          {inventoryItems.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">No inventory items yet</h3>
              <p className="text-slate-400 mb-6">Add your first PS5 to the inventory</p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New PS5
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-colors"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-100">
                          {item.model || "Unknown Model"}
                        </h3>
                        <p className="text-sm text-slate-400">
                          SN: {item.serialNumber}
                        </p>
                      </div>
                      <Badge className={cn("ml-2", getConditionBadgeClass(item.condition))}>
                        {item.condition || "Unknown"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-slate-300">
                          ${item.purchasePrice}
                        </span>
                      </div>
                      
                      {item.purchaseDate && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="text-slate-300">
                            {format(item.purchaseDate, "PP")}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <ShieldCheck className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-slate-300">
                          Warranty: {item.hasWarranty ? "Yes" : "No"}
                        </span>
                      </div>
                      
                      {item.accessories.length > 0 && (
                        <div className="flex items-center text-sm">
                          <Package className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="text-slate-300">
                            {item.accessories.length} accessories
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                      <div className="text-sm text-slate-400">
                        Controllers: {item.controllerCount || "0"}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteItem(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
        
        {/* Draft Section (simplified) */}
        {draftItems.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Draft Items
              <Badge className="ml-3 bg-yellow-600">{draftItems.length} drafts</Badge>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {draftItems.map((item, index) => (
                <div key={`draft-${index}`} className="bg-slate-900/60 border border-yellow-900/30 rounded-lg p-4">
                  <h3 className="font-medium">
                    {item.model || "Draft PS5"}
                    <Badge className="ml-2 bg-yellow-600/80 text-xs">Draft</Badge>
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Last edited: {item.purchaseDate ? format(item.purchaseDate, "PP") : "Unknown date"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      
      {/* Modal */}
      <MultistepInventoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveItem}
        onSaveAsDraft={handleSaveAsDraft}
      />
    </div>
  );
}

export default App;
