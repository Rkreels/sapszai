
import { useCallback, useEffect, useState } from 'react';

export const useVoiceAssistant = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [preferredVoice, setPreferredVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechQueue, setSpeechQueue] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Initialize speech synthesis
  useEffect(() => {
    // Safely check if speechSynthesis is available in the window object
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Initial voices load
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          
          // Try to find a female English voice
          const femaleVoice = availableVoices.find(
            voice => voice.name.includes('Female') || 
                    voice.name.includes('female') || 
                    voice.name.includes('Samantha') ||
                    (voice.name.includes('Google') && voice.lang.includes('en-US'))
          );
          
          // Fallback to any English voice
          const englishVoice = availableVoices.find(
            voice => voice.lang.includes('en')
          );
          
          setPreferredVoice(femaleVoice || englishVoice || availableVoices[0]);
        }
      };
      
      // Load voices initially
      loadVoices();
      
      // Chrome loads voices asynchronously - only attach the event if it exists
      if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      console.warn("Speech synthesis not available in this browser");
    }

    // Cleanup function
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  // Process speech queue
  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking && speechSynthesis) {
      const text = speechQueue[0];
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsActive(true);
        console.log("Voice assistant started speaking");
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeechQueue(current => current.slice(1));
        if (speechQueue.length <= 1) {
          setIsActive(false);
        }
        console.log("Voice assistant finished speaking");
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
        setSpeechQueue(current => current.slice(1));
        if (speechQueue.length <= 1) {
          setIsActive(false);
        }
      };
      
      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Error in speech synthesis:", error);
      }
    }
  }, [speechQueue, isSpeaking, speechSynthesis, preferredVoice]);

  // Speak text function - Modified to stop current speech before starting new
  const speak = useCallback((text: string) => {
    if (!text || !text.trim()) {
      console.warn("Attempted to speak empty text");
      return;
    }
    
    console.log("Voice assistant trying to speak:", text.substring(0, 30) + "...");
    
    // Stop current speech before adding new text
    if (speechSynthesis) {
      try {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        // Clear the queue completely when a new speech request comes in
        setSpeechQueue([text]);
        console.log("Speech queue updated with new text");
      } catch (error) {
        console.error("Error when trying to speak:", error);
      }
    } else {
      // Add to queue if speech synthesis isn't available yet
      setSpeechQueue(current => [...current, text]);
      console.log("Added text to speech queue (speech synthesis not available yet)");
    }
  }, [speechSynthesis]);

  // Stop speaking
  const stop = useCallback(() => {
    if (speechSynthesis) {
      try {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeechQueue([]);
        setIsActive(false);
        console.log("Voice assistant stopped");
      } catch (error) {
        console.error("Error stopping speech:", error);
      }
    }
  }, [speechSynthesis]);

  // Generate detailed educational content with comprehensive SAP S/4HANA information
  const generateEducationalContent = useCallback((topic: string, detail?: string) => {
    const educationalContent = {
      "finance": `The Finance module in SAP S/4HANA provides comprehensive financial management capabilities. It includes General Ledger for real-time financial postings, Accounts Payable for vendor invoice processing and payments, Accounts Receivable for customer billing and collections, Asset Accounting for fixed asset management, Cost Center Accounting for internal cost allocation, Cash Management for liquidity planning, and Financial Planning for budgeting and forecasting. The module uses the Universal Journal for simplified data model and provides real-time financial insights with embedded analytics.`,
      
      "sales": `The Sales module in SAP S/4HANA manages the complete order-to-cash process. It includes Customer Management for maintaining customer master data, Sales Order Processing for order creation and fulfillment, Quotation Management for price quotes and proposals, Contract Management for framework agreements, Pricing for dynamic pricing strategies, Product Catalog for product information management, Billing for invoice creation, Credit Management for credit limit monitoring, Returns Processing for handling customer returns, Commission Management for sales representative compensation, Territory Management for sales area organization, and Sales Analytics for performance insights.`,
      
      "procurement": `The Procurement module handles the complete procure-to-pay process in SAP S/4HANA. It includes Purchase Requisitions for internal purchase requests, Purchase Orders for vendor ordering, Supplier Management for vendor master data and relationships, Contracts for procurement agreements, Source List for approved vendor lists, RFQ Management for quote solicitation, Invoice Verification for three-way matching, Catalog Management for punch-out catalogs, Spend Analysis for procurement insights, Supplier Performance for vendor evaluation, and Contract Management for agreement lifecycle management. The module integrates with Ariba for cloud-based procurement.`,
      
      "manufacturing": `The Manufacturing module in SAP S/4HANA supports discrete and process manufacturing. It includes Production Planning for demand-driven planning, Production Scheduling for capacity and resource planning, Material Requirements Planning for component planning, Work Centers for resource management, Bills of Materials for product structures, Routings for operation sequences, Quality Management for quality control, Maintenance for equipment management, Warehouse Management for shop floor inventory, Cost Analysis for manufacturing cost control, Performance Analytics for OEE monitoring, and Production Reports for operational insights. The module uses advanced planning algorithms and machine learning for optimization.`,
      
      "supply-chain": `The Supply Chain module provides end-to-end supply chain visibility and control. It includes Inventory Management for stock optimization, Warehouse Management for efficient storage and picking, Transportation Management for logistics optimization, Demand Planning for forecast accuracy, Supply Planning for replenishment strategies, Distribution Planning for network optimization, Physical Inventory for cycle counting, Stock Transfers for inter-plant movements, Inbound and Outbound Deliveries for goods receipt and dispatch, and Vendor Managed Inventory for supplier-managed stock. The module leverages SAP IBP for advanced planning capabilities.`,
      
      "project": `Project Management in SAP S/4HANA provides comprehensive project lifecycle management. It includes Project Planning for work breakdown structures, Project Execution for progress tracking, Resource Management for capacity planning, Time Recording for effort capture, Cost Management for budget control, Risk Management for issue mitigation, Document Management for project artifacts, Portfolio Management for strategic alignment, Collaboration for team communication, and Project Analytics for performance insights. The module supports various project types including customer projects, investment projects, and internal orders.`,
      
      "maintenance": `The Maintenance module ensures optimal equipment performance and reliability. It includes Preventive Maintenance for scheduled maintenance, Corrective Maintenance for breakdown repairs, Predictive Maintenance using IoT sensors, Work Order Management for maintenance tasks, Equipment Master for asset information, Maintenance Planning for resource scheduling, Spare Parts Management for inventory control, Maintenance Analytics for performance monitoring, and Service Management for external maintenance services. The module integrates with SAP Asset Intelligence Network for collaborative maintenance.`,
      
      "default": `SAP S/4HANA is a next-generation ERP suite built on the SAP HANA in-memory platform. It combines transactional and analytical processing in real-time, enabling instant insights and intelligent automation. The system features a simplified data model with the Universal Journal, embedded analytics with SAP Analytics Cloud integration, intelligent technologies including machine learning and artificial intelligence, cloud-ready architecture for hybrid deployments, and a modern user experience with SAP Fiori apps. S/4HANA supports various deployment options including on-premise, cloud, and hybrid scenarios.`
    };
    
    const content = educationalContent[topic.toLowerCase() as keyof typeof educationalContent] || 
                    educationalContent.default;
    
    if (detail) {
      return `${detail} ${content}`;
    }
    
    return content;
  }, [speak]);

  // Speak educational content
  const teachAbout = useCallback((topic: string, detail?: string) => {
    const content = generateEducationalContent(topic, detail);
    speak(content);
  }, [generateEducationalContent, speak]);

  return {
    speak,
    stop,
    isSpeaking,
    voices,
    preferredVoice,
    generateEducationalContent,
    teachAbout,
    isActive: speechQueue.length > 0 || isSpeaking
  };
};
