"use client";

import { useState } from "react";
import { Button, IconButton, DropdownButton } from "@/features/ctv/components/ui/Button";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Text } from "@/features/ctv/components/ui/Text";
import { Dropdown } from "@/features/ctv/components/ui/Dropdown";
import { Tooltip } from "@/features/ctv/components/ui/Tooltip";
import { Pill } from "@/features/ctv/components/ui/Pill";
import { TabBar } from "@/features/ctv/components/ui/TabBar";
import { Modal } from "@/features/ctv/components/ui/Modal";
import { Radio } from "@/features/ctv/components/ui/RadioButton";
import { Checkbox } from "@/features/ctv/components/ui/Checkbox";
import { Header } from "@/features/ctv/components/ui/Header";
import { Input } from "@/features/ctv/components/ui/Input";
import { Avatar } from "@/features/ctv/components/ui/Avatar";
import { Banner } from "@/features/ctv/components/ui/Banner";
import { GuidanceCard } from "@/features/ctv/components/ui/GuidanceCard";
import { Check } from "@/features/ctv/components/icons/filled/Check";
import { Info } from "@/features/ctv/components/icons/filled/Info";
import * as FilledIcons from "@/features/ctv/components/icons/filled";
import * as OutlinedIcons from "@/features/ctv/components/icons/outlined";

// Combine all unique icon names and sort alphabetically
const allIconNames = Array.from(new Set([
  ...Object.keys(FilledIcons),
  ...Object.keys(OutlinedIcons),
])).sort();

export default function Stylesheet() {
  // State for dropdown menu demos
  const [checkboxSelections, setCheckboxSelections] = useState<Record<string, boolean>>({
    item1: true,
    item2: true,
    item3: false,
    item4: false,
  });
  const [searchCheckboxSelections, setSearchCheckboxSelections] = useState<Record<string, boolean>>({
    marketing: true,
    sales: true,
    engineering: false,
    design: false,
    finance: true,
    hr: false,
    operations: false,
  });
  const [radioSelection, setRadioSelection] = useState<string | null>("option1");
  const [searchValue, setSearchValue] = useState("");
  
  // TabBar state
  const [textOnlyTab, setTextOnlyTab] = useState<string>("tab1");
  const [textIconTab, setTextIconTab] = useState<string>("tab1");
  const [iconOnlyTab, setIconOnlyTab] = useState<string>("tab1");
  
  // Modal state
  const [smallModalOpen, setSmallModalOpen] = useState(false);
  const [mediumModalOpen, setMediumModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);
  
  // RadioButton state (separate state for each group)
  const [selectedRadioVertical, setSelectedRadioVertical] = useState<string | null>("option1");
  const [selectedRadioHorizontal, setSelectedRadioHorizontal] = useState<string | null>("option2");
  
  // Checkbox state (separate state for each group)
  const [selectedCheckboxesVertical, setSelectedCheckboxesVertical] = useState<string[]>(["checkbox1"]);
  const [selectedCheckboxesHorizontal, setSelectedCheckboxesHorizontal] = useState<string[]>(["checkbox1", "checkbox3"]);

  // Searchable items for the "With Search" dropdown
  const searchableItems = [
    { id: "marketing", label: "Marketing", description: "Brand and campaigns" },
    { id: "sales", label: "Sales", description: "Revenue and deals" },
    { id: "engineering", label: "Engineering", description: "Product development" },
    { id: "design", label: "Design", description: "UI/UX and creative" },
    { id: "finance", label: "Finance", description: "Budget and accounting" },
    { id: "hr", label: "Human Resources", description: "People operations" },
    { id: "operations", label: "Operations", description: "Business processes" },
  ];

  // Filter items based on search value (matches label or description, case-insensitive)
  const filteredSearchItems = searchableItems.filter((item) => {
    if (!searchValue.trim()) return true;
    const query = searchValue.toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  // Helper function for radio button toggle behavior
  const handleRadioChange = (
    currentSelection: string | null,
    setSelection: (value: string | null) => void,
    optionValue: string
  ) => {
    // If clicking the already selected option, deselect it
    // Otherwise, select the new option (automatically deselects the previous one)
    if (currentSelection === optionValue) {
      setSelection(null);
    } else {
      setSelection(optionValue);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F7F8] p-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-[#1C2B33]">Component Library</h1>
        <p className="mt-2 text-[#5C6970]">
          A collection of all UI components for prototyping.
        </p>
      </header>

      {/* ============================================ */}
      {/* 1. TYPOGRAPHY (Foundation) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Typography</h2>
        
        <div className="space-y-8">

          {/* Text Styles */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Text Styles</h3>
            <div className="space-y-4 bg-white rounded-lg p-4">
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">App Name (24/28 Bold)</span>
                <Text variant="appName">App Name</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Header 1 (20/24 Bold)</span>
                <Text variant="header1">Header 1</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Header 2 (18/22 Bold)</span>
                <Text variant="header2">Header 2</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Header 3 (16/20 Bold)</span>
                <Text variant="header3">Header 3</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Header 4 (15/20 Bold)</span>
                <Text variant="header4">Header 4</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Label (14/20 Medium)</span>
                <Text variant="label">Label / Button Text</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Value (14/20 Regular)</span>
                <Text variant="value">Value</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Value Desc (12/16 Regular)</span>
                <Text variant="valueDescription">Value Description</Text>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-[#8A9AA8] w-40">Value Desc Bold (12/16 Bold)</span>
                <Text variant="valueDescriptionBold">Value Description Bold</Text>
              </div>
            </div>
          </div>

          {/* Text Colors */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Text Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#1C2B33]" />
                <div>
                  <Text variant="label" color="primary">Primary</Text>
                  <span className="text-xs text-[#8A9AA8]">#1C2B33</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#1C2B33]" />
                <div>
                  <Text variant="label" color="value">Value</Text>
                  <span className="text-xs text-[#8A9AA8]">#1C2B33</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#465A69]" />
                <div>
                  <Text variant="label" color="description">Description</Text>
                  <span className="text-xs text-[#8A9AA8]">#465A69</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[rgba(28,43,51,0.6)]" />
                <div>
                  <Text variant="label" color="disabled">Disabled</Text>
                  <span className="text-xs text-[#8A9AA8]">#1C2B33 60%</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[rgba(28,43,51,0.65)]" />
                <div>
                  <Text variant="label" color="placeholder">Placeholder</Text>
                  <span className="text-xs text-[#8A9AA8]">#1C2B33 65%</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#0A78BE]" />
                <div>
                  <Text variant="label" color="link">Link</Text>
                  <span className="text-xs text-[#8A9AA8]">#0A78BE</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#344854]" />
                <div>
                  <Text variant="label" color="info">Info</Text>
                  <span className="text-xs text-[#8A9AA8]">#344854</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[rgba(52,72,84,0.6)]" />
                <div>
                  <Text variant="label" color="infoDisabled">Info Disabled</Text>
                  <span className="text-xs text-[#8A9AA8]">#344854 60%</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#A20C17]" />
                <div>
                  <Text variant="label" color="error">Error</Text>
                  <span className="text-xs text-[#8A9AA8]">#A20C17</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[rgba(162,12,23,0.6)]" />
                <div>
                  <Text variant="label" color="errorDisabled">Error Disabled</Text>
                  <span className="text-xs text-[#8A9AA8]">#A20C17 60%</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#006B4E]" />
                <div>
                  <Text variant="label" color="success">Success</Text>
                  <span className="text-xs text-[#8A9AA8]">#006B4E</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[rgba(0,107,78,0.6)]" />
                <div>
                  <Text variant="label" color="successDisabled">Success Disabled</Text>
                  <span className="text-xs text-[#8A9AA8]">#006B4E 60%</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#B35401]" />
                <div>
                  <Text variant="label" color="warning">Warning</Text>
                  <span className="text-xs text-[#8A9AA8]">#B35401</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[rgba(179,84,1,0.6)]" />
                <div>
                  <Text variant="label" color="warningDisabled">Warning Disabled</Text>
                  <span className="text-xs text-[#8A9AA8]">#B35401 60%</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[#543E8F]" />
                <div>
                  <Text variant="label" color="onboarding">Onboarding</Text>
                  <span className="text-xs text-[#8A9AA8]">#543E8F</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 flex items-start gap-3">
                <div className="w-4 h-4 rounded shrink-0 mt-0.5 bg-[rgba(84,62,143,0.6)]" />
                <div>
                  <Text variant="label" color="onboardingDisabled">Onboarding Disabled</Text>
                  <span className="text-xs text-[#8A9AA8]">#543E8F 60%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 2. BUTTONS (Most Used) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Buttons</h2>
        
        <div className="space-y-8">
          
          {/* Primary Button */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Primary</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="primary">Primary Button</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </div>

          {/* Secondary Button */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Secondary</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>

          {/* Flat Button */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Flat</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="flat">Flat Button</Button>
              <Button variant="flat" disabled>Disabled</Button>
            </div>
          </div>

          {/* Button with Icon (Left) */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Button with Icon</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="primary">
                <Icon name="CloudDownload" variant="filled" />
                Primary
              </Button>
              <Button variant="secondary">
                <Icon name="FileDownload" variant="outlined" />
                Secondary
              </Button>
              <Button variant="flat">
                <Icon name="Settings" variant="outlined" />
                Flat
              </Button>
            </div>
          </div>

          {/* Dropdown Button */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Dropdown Button</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="primary" dropdown>Primary Dropdown</Button>
              <Button variant="secondary" dropdown>Secondary Dropdown</Button>
              <Button variant="flat" dropdown>Flat Dropdown</Button>
            </div>
          </div>

          {/* Icon-Only Button */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Icon-Only Button</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <IconButton icon="CloudDownload" iconVariant="outlined" variant="primary" />
              <IconButton icon="CloudDownload" iconVariant="outlined" variant="secondary" />
              <IconButton icon="CloudDownload" iconVariant="outlined" variant="flat" />
              <IconButton icon="CloudDownload" iconVariant="outlined" variant="secondary" disabled />
            </div>
          </div>

          {/* Dropdown Button with Thumbnail */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Dropdown Button with Thumbnail</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <DropdownButton
                title="Chicken Company"
                subtitle="Business portfolio"
                thumbnail={
                  <img 
                    src="/placeholder.png" 
                    alt="Company" 
                    className="w-full h-full object-cover"
                  />
                }
              />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 3. INPUTS (Form Foundation) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Inputs</h2>
        
        <div className="grid grid-cols-2 gap-6 max-w-[800px]">
          {/* Basic Input */}
          <div className="bg-white rounded-lg p-4">
            <Input 
              label="Header" 
              placeholder="Input field"
            />
          </div>

          {/* Input with Helper Text */}
          <div className="bg-white rounded-lg p-4">
            <Input 
              label="Header" 
              placeholder="Input field"
              helperText="This is helper text"
            />
          </div>

          {/* Input with Error */}
          <div className="bg-white rounded-lg p-4">
            <Input 
              label="Header" 
              placeholder="Input field"
              errorMessage="This field is required"
            />
          </div>

          {/* Disabled Input */}
          <div className="bg-white rounded-lg p-4">
            <Input 
              label="Header" 
              placeholder="Input field"
              disabled
            />
          </div>

          {/* Search Input */}
          <div className="bg-white rounded-lg p-4">
            <Input 
              variant="search"
              placeholder="Search existing audiences"
            />
          </div>

          {/* Search Input with Label */}
          <div className="bg-white rounded-lg p-4">
            <Input 
              variant="search"
              label="Search"
              placeholder="Search existing audiences"
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 4. RADIO BUTTONS (Form Controls) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Radio Buttons</h2>
        
        <div className="space-y-8">

          {/* Vertical Radio Group */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Vertical (default)</h3>
            <div className="bg-white rounded-lg p-4 inline-block">
              <Radio.Group value={selectedRadioVertical} onChange={setSelectedRadioVertical} name="demo-radio-vertical">
                <Radio value="option1" label="Option 1" />
                <Radio value="option2" label="Option 2" />
                <Radio value="option3" label="Option 3" />
              </Radio.Group>
            </div>
          </div>

          {/* Horizontal Radio Group */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Horizontal</h3>
            <div className="bg-white rounded-lg p-4 inline-block">
              <Radio.Group value={selectedRadioHorizontal} onChange={setSelectedRadioHorizontal} name="demo-radio-horizontal" orientation="horizontal">
                <Radio value="option1" label="Option 1" />
                <Radio value="option2" label="Option 2" />
                <Radio value="option3" label="Option 3" />
              </Radio.Group>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 5. CHECKBOXES (Form Controls) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Checkboxes</h2>
        
        <div className="space-y-8">

          {/* Vertical Checkbox Group */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Vertical (default)</h3>
            <div className="bg-white rounded-lg p-4 inline-block">
              <Checkbox.Group values={selectedCheckboxesVertical} onChange={setSelectedCheckboxesVertical} name="demo-checkbox-vertical">
                <Checkbox value="checkbox1" label="Checkbox 1" />
                <Checkbox value="checkbox2" label="Checkbox 2" />
                <Checkbox value="checkbox3" label="Checkbox 3" />
              </Checkbox.Group>
            </div>
          </div>

          {/* Horizontal Checkbox Group */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Horizontal</h3>
            <div className="bg-white rounded-lg p-4 inline-block">
              <Checkbox.Group values={selectedCheckboxesHorizontal} onChange={setSelectedCheckboxesHorizontal} name="demo-checkbox-horizontal" orientation="horizontal">
                <Checkbox value="checkbox1" label="Checkbox 1" />
                <Checkbox value="checkbox2" label="Checkbox 2" />
                <Checkbox value="checkbox3" label="Checkbox 3" />
              </Checkbox.Group>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 6. DROPDOWN MENUS (Selection Patterns) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Dropdown Menus</h2>
        
        <div className="space-y-8">
          
          {/* Simple Menu */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Simple Menu</h3>
            <div className="flex items-start gap-4 flex-wrap">
              <Dropdown
                trigger={<Button variant="secondary" dropdown>Actions</Button>}
                width={180}
              >
                <Dropdown.List>
                  <Dropdown.Item label="Edit" onClick={() => {}} />
                  <Dropdown.Item label="Duplicate" onClick={() => {}} />
                  <Dropdown.Item label="Archive" onClick={() => {}} />
                  <Dropdown.Divider />
                  <Dropdown.Item label="Delete" onClick={() => {}} disabled />
                </Dropdown.List>
              </Dropdown>

              <Dropdown
                trigger={<Button variant="secondary" dropdown>With Icons</Button>}
                width={200}
              >
                <Dropdown.List>
                  <Dropdown.Item label="Edit" icon="Pencil" onClick={() => {}} />
                  <Dropdown.Item label="Duplicate" icon="RefreshRight" onClick={() => {}} />
                  <Dropdown.Item label="Archive" icon="CloudDownload" onClick={() => {}} disabled />
                  <Dropdown.Divider />
                  <Dropdown.Item label="Delete" icon="Trash" onClick={() => {}} />
                </Dropdown.List>
              </Dropdown>

              <Dropdown
                trigger={<Button variant="secondary" dropdown>With Descriptions</Button>}
                width={260}
              >
                <Dropdown.List>
                  <Dropdown.Item 
                    label="Edit Campaign" 
                    description="Modify campaign settings"
                    onClick={() => {}} 
                  />
                  <Dropdown.Item 
                    label="Duplicate" 
                    description="Create a copy"
                    onClick={() => {}} 
                  />
                  <Dropdown.Item 
                    label="Archive" 
                    description="Not available"
                    onClick={() => {}}
                    disabled
                  />
                </Dropdown.List>
              </Dropdown>
            </div>
          </div>

          {/* Multi-Select Menu (Checkbox) */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Multi-Select Menu (Checkbox)</h3>
            <div className="flex items-start gap-4 flex-wrap">
              <Dropdown
                trigger={<Button variant="secondary" dropdown>Filter by Status</Button>}
                width={240}
              >
                <Dropdown.List>
                  <Dropdown.Item 
                    label="Active" 
                    description="Currently running"
                    selectionType="checkbox"
                    selected={checkboxSelections.item1}
                    onSelectionChange={(selected) => setCheckboxSelections(prev => ({ ...prev, item1: selected }))}
                  />
                  <Dropdown.Item 
                    label="Paused" 
                    description="Temporarily stopped"
                    selectionType="checkbox"
                    selected={checkboxSelections.item2}
                    onSelectionChange={(selected) => setCheckboxSelections(prev => ({ ...prev, item2: selected }))}
                  />
                  <Dropdown.Item 
                    label="Completed" 
                    description="Finished campaigns"
                    selectionType="checkbox"
                    selected={checkboxSelections.item3}
                    onSelectionChange={(selected) => setCheckboxSelections(prev => ({ ...prev, item3: selected }))}
                  />
                  <Dropdown.Item 
                    label="Archived" 
                    description="Not available"
                    selectionType="checkbox"
                    selected={checkboxSelections.item4}
                    onSelectionChange={(selected) => setCheckboxSelections(prev => ({ ...prev, item4: selected }))}
                    disabled
                  />
                </Dropdown.List>
              </Dropdown>

              <Dropdown
                trigger={<Button variant="secondary" dropdown>With Search</Button>}
                width={280}
              >
                <Dropdown.Search 
                  placeholder="Search departments..." 
                  value={searchValue}
                  onChange={setSearchValue}
                />
                <Dropdown.List maxHeight={200}>
                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map((item) => (
                      <Dropdown.Item
                        key={item.id}
                        label={item.label}
                        description={item.description}
                        selectionType="checkbox"
                        selected={searchCheckboxSelections[item.id] || false}
                        onSelectionChange={(selected) => 
                          setSearchCheckboxSelections(prev => ({ ...prev, [item.id]: selected }))
                        }
                      />
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-[14px] text-[#5C6970] font-optimistic">
                      No results found
                    </div>
                  )}
                </Dropdown.List>
              </Dropdown>
            </div>
          </div>

          {/* Single-Select Menu (Radio) */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Single-Select Menu (Radio)</h3>
            <div className="flex items-start gap-4 flex-wrap">
              <Dropdown
                trigger={<Button variant="secondary" dropdown>Sort By</Button>}
                width={220}
              >
                <Dropdown.List>
                  <Dropdown.Item 
                    label="Name" 
                    description="Alphabetical order"
                    selectionType="radio"
                    selected={radioSelection === "option1"}
                    onSelectionChange={() => handleRadioChange(radioSelection, setRadioSelection, "option1")}
                  />
                  <Dropdown.Item 
                    label="Date Created" 
                    description="Newest first"
                    selectionType="radio"
                    selected={radioSelection === "option2"}
                    onSelectionChange={() => handleRadioChange(radioSelection, setRadioSelection, "option2")}
                  />
                  <Dropdown.Item 
                    label="Last Modified" 
                    description="Most recent changes"
                    selectionType="radio"
                    selected={radioSelection === "option3"}
                    onSelectionChange={() => handleRadioChange(radioSelection, setRadioSelection, "option3")}
                  />
                  <Dropdown.Item 
                    label="Budget" 
                    description="Highest to lowest"
                    selectionType="radio"
                    selected={radioSelection === "option4"}
                    onSelectionChange={() => handleRadioChange(radioSelection, setRadioSelection, "option4")}
                  />
                </Dropdown.List>
              </Dropdown>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 7. HEADERS (Content Organization) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Headers</h2>
        
        <div className="flex gap-6">
          {/* Left Column: Without Description */}
          <div className="bg-white rounded-lg p-4 min-w-[300px] space-y-6">
            <Header>Audience controls</Header>
            <Header leftIcon={<Check className="w-4 h-4 text-[#006B4E]" />}>
              Audience controls
            </Header>
            <Header rightIcon={<Info className="w-3 h-3" />}>
              Audience controls
            </Header>
            <Header 
              leftIcon={<Check className="w-4 h-4 text-[#006B4E]" />}
              rightIcon={<Info className="w-3 h-3" />}
            >
              Audience controls
            </Header>
          </div>
          
          {/* Right Column: With Description */}
          <div className="bg-white rounded-lg p-4 min-w-[400px] space-y-6">
            <Header
              description="Set criteria for where ads for this campaign can be delivered."
            >
              Audience controls
            </Header>
            <Header 
              leftIcon={<Check className="w-4 h-4 text-[#006B4E]" />}
              description="Set criteria for where ads for this campaign can be delivered."
            >
              Audience controls
            </Header>
            <Header 
              rightIcon={<Info className="w-3 h-3" />}
              description="Set criteria for where ads for this campaign can be delivered."
            >
              Audience controls
            </Header>
            <Header 
              leftIcon={<Check className="w-4 h-4 text-[#006B4E]" />}
              rightIcon={<Info className="w-3 h-3" />}
              description="Set criteria for where ads for this campaign can be delivered."
            >
              Audience controls
            </Header>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 8. PILLS (Status Indicators) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Pills</h2>
        
        <div className="space-y-8">

          {/* Pill Variants */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Variants</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Pill variant="default">Default</Pill>
              <Pill variant="success">Success</Pill>
              <Pill variant="warning">Warning</Pill>
              <Pill variant="error">Error</Pill>
            </div>
          </div>

          {/* Pill with Icons */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">With Icons</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Pill variant="default" icon="Tag">Category</Pill>
              <Pill variant="success" icon="Check" iconVariant="filled">Completed</Pill>
              <Pill variant="warning" icon="WarningTriangle">Pending</Pill>
              <Pill variant="error" icon="Close">Failed</Pill>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 9. AVATARS (User Representation) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Avatars</h2>
        
        <div className="space-y-8">

          {/* Avatar Sizes with Image */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Sizes (with Image)</h3>
            <div className="flex items-center gap-4 bg-white rounded-lg p-4">
              <Avatar size={16} src="/placeholder.png" alt="User" />
              <Avatar size={24} src="/placeholder.png" alt="User" />
              <Avatar size={32} src="/placeholder.png" alt="User" />
              <Avatar size={48} src="/placeholder.png" alt="User" />
              <Avatar size={64} src="/placeholder.png" alt="User" />
            </div>
          </div>

          {/* Avatar with Initials */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">With Initials (Fallback)</h3>
            <div className="flex items-center gap-4 bg-white rounded-lg p-4">
              <Avatar size={16} initials="JD" />
              <Avatar size={24} initials="JD" />
              <Avatar size={32} initials="JD" />
              <Avatar size={48} initials="JD" />
              <Avatar size={64} initials="JD" />
            </div>
          </div>

          {/* Empty Avatar */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Empty Placeholder</h3>
            <div className="flex items-center gap-4 bg-white rounded-lg p-4">
              <Avatar size={16} />
              <Avatar size={24} />
              <Avatar size={32} />
              <Avatar size={48} />
              <Avatar size={64} />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 10. BANNERS (Inline Feedback) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Banners</h2>
        
        <div className="space-y-8 max-w-[800px]">

          {/* Informational Banners */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Informational</h3>
            <div className="space-y-4">
              {/* Title only */}
              <Banner 
                variant="info" 
                title="Preview mode is enabled"
              />
              {/* Title with description */}
              <Banner 
                variant="info" 
                title="Preview mode is enabled"
                description="You are viewing a preview of your campaign. Changes will not be saved."
              />
              {/* Title with button */}
              <Banner 
                variant="info" 
                title="Preview mode is enabled"
                buttonText="Exit Preview"
                onButtonClick={() => {}}
              />
              {/* Title, description, and button */}
              <Banner 
                variant="info" 
                title="Preview mode is enabled"
                description="You are viewing a preview of your campaign."
                buttonText="Exit Preview"
                onButtonClick={() => {}}
              />
            </div>
          </div>

          {/* Warning Banners */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Warning</h3>
            <div className="space-y-4">
              {/* Title only */}
              <Banner 
                variant="warning" 
                title="Your campaign budget is running low"
              />
              {/* Title with description */}
              <Banner 
                variant="warning" 
                title="Your campaign budget is running low"
                description="Consider increasing your budget to maintain campaign performance."
              />
              {/* Title with button */}
              <Banner 
                variant="warning" 
                title="Your campaign budget is running low"
                buttonText="Adjust Budget"
                onButtonClick={() => {}}
              />
              {/* Title, description, and button */}
              <Banner 
                variant="warning" 
                title="Your campaign budget is running low"
                description="Your budget will be depleted in 2 days."
                buttonText="Adjust Budget"
                onButtonClick={() => {}}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 11. GUIDANCE CARDS (Contextual Feedback) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Guidance Cards</h2>
        
        <div className="space-y-6 max-w-[500px]">
          
          {/* Active Feedback */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Active Feedback</h3>
            <GuidanceCard variant="activeFeedback" title="Active Feedback">
              This is the main card text providing additional context or guidance.
            </GuidanceCard>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Help</h3>
            <GuidanceCard variant="help" title="Help">
              This is helpful information to guide users through the process.
            </GuidanceCard>
          </div>

          {/* Success */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Success</h3>
            <GuidanceCard variant="success" title="Success">
              Your changes have been saved successfully.
            </GuidanceCard>
          </div>

          {/* Warning */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Warning</h3>
            <GuidanceCard variant="warning" title="Warning">
              Please review your settings before continuing.
            </GuidanceCard>
          </div>

          {/* Error */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Error</h3>
            <GuidanceCard variant="error" title="Error">
              Something went wrong. Please try again.
            </GuidanceCard>
          </div>

          {/* Title Only Examples */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Title Only (No Description)</h3>
            <div className="space-y-3">
              <GuidanceCard variant="activeFeedback" title="Active feedback without description" />
              <GuidanceCard variant="help" title="Need help? Click here for more info" />
              <GuidanceCard variant="success" title="Operation completed successfully" />
              <GuidanceCard variant="warning" title="Please review before continuing" />
              <GuidanceCard variant="error" title="Unable to process request" />
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 12. TAB BAR (Navigation) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Tab Bar</h2>
        
        <div className="space-y-8">

          {/* Text Only Tabs */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Text Only</h3>
            <TabBar value={textOnlyTab} onChange={setTextOnlyTab}>
              <TabBar.Tab value="tab1" label="Tab 1" />
              <TabBar.Tab value="tab2" label="Tab 2" />
              <TabBar.Tab value="tab3" label="Tab 3" />
            </TabBar>
          </div>

          {/* Text + Icon Tabs */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Text + Icon</h3>
            <TabBar value={textIconTab} onChange={setTextIconTab}>
              <TabBar.Tab value="tab1" label="Tab 1" icon="ChartVerticalBars" />
              <TabBar.Tab value="tab2" label="Tab 2" icon="ChartAscendingBars" />
              <TabBar.Tab value="tab3" label="Tab 3" icon="ChartPie" />
            </TabBar>
          </div>

          {/* Icon Only Tabs */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Icon Only</h3>
            <TabBar value={iconOnlyTab} onChange={setIconOnlyTab}>
              <TabBar.Tab value="tab1" icon="ChartVerticalBars" aria-label="Bar Chart" />
              <TabBar.Tab value="tab2" icon="ChartAscendingBars" aria-label="Line Chart" />
              <TabBar.Tab value="tab3" icon="ChartPie" aria-label="Pie Chart" />
            </TabBar>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 13. MODALS (Overlays) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Modals</h2>
        
        <div className="space-y-8">

          {/* Modal Sizes */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Sizes</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="secondary" onClick={() => setSmallModalOpen(true)}>
                Small Modal (400px)
              </Button>
              <Button variant="secondary" onClick={() => setMediumModalOpen(true)}>
                Medium Modal (560px)
              </Button>
              <Button variant="secondary" onClick={() => setLargeModalOpen(true)}>
                Large Modal (800px)
              </Button>
            </div>
          </div>

        </div>

        {/* Small Modal */}
        <Modal isOpen={smallModalOpen} onClose={() => setSmallModalOpen(false)} size="small">
          <Modal.Header title="Small Modal" description="Ideal for confirmations and alerts" />
          <Modal.Body>
            This is a small modal (400px width). It&apos;s ideal for simple confirmations, alerts, or short forms.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSmallModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setSmallModalOpen(false)}>Confirm</Button>
          </Modal.Footer>
        </Modal>

        {/* Medium Modal */}
        <Modal isOpen={mediumModalOpen} onClose={() => setMediumModalOpen(false)} size="medium">
          <Modal.Header title="Medium Modal" description="Default size for most use cases" />
          <Modal.Body>
            This is a medium modal (560px width). It&apos;s the default size and works well for most use cases including forms, detailed information, and multi-step processes. You can close this modal by clicking the X button, pressing Escape, or clicking the backdrop.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMediumModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setMediumModalOpen(false)}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Large Modal */}
        <Modal isOpen={largeModalOpen} onClose={() => setLargeModalOpen(false)} size="large">
          <Modal.Header title="Large Modal" description="Best for complex content and data tables" />
          <Modal.Body>
            This is a large modal (800px-2000px width). It&apos;s best suited for complex content like data tables, detailed forms, or content that requires more horizontal space. Large modals provide ample space for rich content while still maintaining focus on the task at hand.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setLargeModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setLargeModalOpen(false)}>Submit</Button>
          </Modal.Footer>
        </Modal>

      </section>

      {/* ============================================ */}
      {/* 14. TOOLTIPS (Contextual Help) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Tooltips</h2>
        
        <div className="space-y-8">

          {/* Simple Tooltip */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Simple Tooltip</h3>
            <div className="flex items-center gap-8 flex-wrap">
              <Tooltip content="This is a simple tooltip">
                <Button variant="secondary">Hover for tooltip</Button>
              </Tooltip>

              <Tooltip content="Info" preferredPosition="right">
                <IconButton icon="Info" iconVariant="outlined" variant="flat" />
              </Tooltip>
            </div>
          </div>

          {/* Pop Over Tooltip */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Pop Over Tooltip</h3>
            <div className="flex items-center gap-8 flex-wrap">
              <Tooltip
                variant="popover"
                content={
                  <Tooltip.Content
                    title="Popover Title"
                    description="Popovers provide contextual, feature-level information about an element and are displayed when accessed by the user."
                  />
                }
              >
                <Button variant="secondary">Basic popover</Button>
              </Tooltip>

              <Tooltip
                variant="popover"
                content={
                  <Tooltip.Content
                    title="Learn More"
                    description="This popover includes a link for users who want additional information."
                    linkText="View documentation"
                    onLinkClick={() => alert("Link clicked!")}
                  />
                }
              >
                <Button variant="secondary">With link</Button>
              </Tooltip>

              <Tooltip
                variant="popover"
                preferredPosition="bottom"
                content={
                  <Tooltip.Content
                    title="Campaign Settings"
                    description="Configure your campaign parameters including budget, schedule, and targeting options."
                    linkText="Open settings"
                    onLinkClick={() => {}}
                  />
                }
              >
                <IconButton icon="Settings" iconVariant="outlined" variant="flat" />
              </Tooltip>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================ */}
      {/* 15. ICONS (Reference) */}
      {/* ============================================ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">Icons</h2>
        
        <div className="space-y-8">

          {/* Icon Variants */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Variants</h3>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <Icon name="Bell" variant="outlined" size={24} />
                <span className="text-xs text-[#8A9AA8]">Outlined</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="Bell" variant="filled" size={24} />
                <span className="text-xs text-[#8A9AA8]">Filled</span>
              </div>
            </div>
          </div>

          {/* Icon Sizes */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">Sizes</h3>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Icon name="Bell" variant="filled" size={12} />
                <span className="text-xs text-[#8A9AA8]">12px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="Bell" variant="filled" size={16} />
                <span className="text-xs text-[#8A9AA8]">16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="Bell" variant="filled" size={20} />
                <span className="text-xs text-[#8A9AA8]">20px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="Bell" variant="filled" size={24} />
                <span className="text-xs text-[#8A9AA8]">24px</span>
              </div>
            </div>
          </div>

          {/* All Icons */}
          <div>
            <h3 className="text-sm font-medium text-[#5C6970] mb-3">All Icons ({allIconNames.length})</h3>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4">
              {allIconNames.map((iconName) => {
                const hasOutlined = iconName in OutlinedIcons;
                const hasFilled = iconName in FilledIcons;
                return (
                  <div key={iconName} className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white">
                    <div className="flex gap-1">
                      {hasOutlined && (
                        <Icon name={iconName as any} variant="outlined" size={20} className="text-[#1C2B33]" />
                      )}
                      {hasFilled && (
                        <Icon name={iconName as any} variant="filled" size={20} className="text-[#5C6970]" />
                      )}
                    </div>
                    <span className="text-[10px] text-center text-[#8A9AA8] leading-tight break-all">{iconName}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
