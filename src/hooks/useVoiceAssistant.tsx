
import { useState, useCallback } from 'react';

interface VoiceAssistantHook {
  speak: (text: string, options?: SpeechSynthesisUtterance) => void;
  stop: () => void;
  isSpeaking: boolean;
  teachAbout: (module: string, content: string) => void;
  generateEducationalContent: (module: string) => string;
}

export const useVoiceAssistant = (): VoiceAssistantHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, options?: Partial<SpeechSynthesisUtterance>) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply options if provided
      if (options) {
        Object.assign(utterance, options);
      }
      
      // Default settings
      utterance.rate = options?.rate || 0.9;
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, [window]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [window]);

  const teachAbout = useCallback((module: string, content: string) => {
    const educationalContent = generateEducationalContent(module);
    const fullContent = `${content} ${educationalContent}`;
    speak(fullContent);
  }, [speak]);

  const generateEducationalContent = useCallback((module: string): string => {
    const contentMap: Record<string, string> = {
      // Procurement Module
      'procurement': 'Procurement in SAP S/4HANA encompasses the complete procure-to-pay process. This includes purchase requisitions for internal requests, purchase orders for supplier commitments, goods receipt for delivery verification, and invoice verification for payment processing. The system supports strategic sourcing through RFQ management, supplier evaluation, and contract management. Advanced features include automated approval workflows, budget controls, and real-time analytics for spend optimization.',
      'Purchase Orders': 'Purchase Orders are formal commitments to suppliers for goods or services. The process begins with creating a PO from approved requisitions, selecting qualified suppliers, and defining delivery terms. Key features include multi-level approval workflows based on amount thresholds, automatic budget checks, delivery scheduling, and goods receipt matching. The system tracks order status from creation through delivery and supports change management for modifications.',
      'Supplier Management': 'Supplier Management maintains comprehensive vendor master data including qualification status, certifications, performance metrics, and risk assessments. The system supports vendor lifecycle management from registration through performance monitoring. Key capabilities include supplier scorecards, risk evaluation, contract compliance tracking, and automated performance reporting. Integration with procurement processes ensures only qualified suppliers can be selected for orders.',
      'Contract Management': 'Contract Management handles all supplier agreements including framework contracts, pricing agreements, and service level agreements. The system tracks contract terms, renewal dates, spending against contracts, and compliance requirements. Features include automated notifications for contract expirations, version control for amendments, and integration with purchase orders to enforce contracted terms and pricing.',
      'Source Determination': 'Source Determination identifies the optimal supplier for each procurement requirement based on predefined criteria such as price, quality, delivery capability, and strategic fit. The system evaluates supplier qualifications, contract terms, and performance history to recommend the best sourcing option. Advanced features include automated source selection rules and supplier rotation strategies.',
      'Goods Receipt': 'Goods Receipt processes incoming deliveries by verifying quantities, quality, and delivery terms against purchase orders. The system updates inventory records, triggers invoice verification, and handles discrepancies through exception management. Key features include mobile receipt processing, quality inspection workflows, and automatic GRN generation for accounting integration.',
      'Invoice Verification': 'Invoice Verification matches supplier invoices with purchase orders and goods receipts to ensure accurate payment processing. The system performs three-way matching to verify quantities, prices, and delivery confirmations. Features include automatic tolerance checking, discrepancy resolution workflows, and integration with accounts payable for payment release.',
      'Bidding & Auctions': 'Bidding & Auctions enables competitive sourcing through online bidding platforms and reverse auctions. The system supports multiple auction formats including sealed bid, open bidding, and reverse auctions. Features include supplier invitation management, bid evaluation criteria, and automated award recommendations based on total cost of ownership calculations.',

      // Finance Module
      'finance': 'Finance in SAP S/4HANA provides real-time financial management with integrated accounting, cash management, and financial planning. The Universal Journal enables single source of truth for all financial data with real-time reporting and analytics. Key capabilities include accounts payable and receivable management, asset accounting, cost center and profit center accounting, and comprehensive financial reporting with drill-down capabilities.',
      'Financial Consolidation Process': 'Financial Consolidation in SAP S/4HANA enables group reporting through automated consolidation processes. The system handles currency translation using configurable exchange rates, processes elimination entries for intercompany transactions, and generates consolidated financial statements. Advanced features include minority interest calculations, goodwill tracking, and multi-GAAP reporting capabilities for compliance with various accounting standards.',
      'Cost Accounting Management': 'Cost Accounting provides comprehensive cost management through cost center accounting, profit center accounting, and internal orders. The system enables accurate cost allocation using various methods including direct allocation, step-down, and activity-based costing. Key features include budget planning and control, variance analysis, and profitability analysis by various dimensions such as products, customers, and market segments.',
      'Treasury Management': 'Treasury Management handles cash and liquidity management, bank account management, and financial risk management. The system provides real-time cash positioning, automated bank statement processing, and cash flow forecasting. Advanced features include foreign exchange management, hedge accounting, and integration with payment factories for centralized payment processing.',
      'Tax Management': 'Tax Management automates tax calculations, compliance reporting, and audit trails across multiple jurisdictions. The system handles VAT, withholding tax, and other tax types with configurable tax codes and rates. Key capabilities include automatic tax determination, electronic tax reporting, and integration with external tax engines for complex tax scenarios.',

      // Human Resources Module
      'human-resources': 'Human Resources in SAP S/4HANA provides comprehensive workforce management including employee central for master data, organizational management, time and attendance tracking, payroll processing, and talent management. The system supports global HR processes with localized compliance requirements and self-service capabilities for employees and managers.',
      'Employee Central Management': 'Employee Central serves as the central hub for all employee information including personal data, organizational assignments, compensation details, and benefits enrollment. The system provides role-based access controls, audit trails, and integration with external systems. Key features include employee self-service portals, manager dashboards, and automated workflow processing for HR transactions.',
      'Time Management': 'Time Management captures and processes employee working time including clock-in/out, attendance tracking, leave management, and overtime calculations. The system supports flexible work arrangements, shift planning, and compliance with labor regulations. Advanced features include mobile time recording, automated approval workflows, and integration with payroll processing.',
      'Talent Management': 'Talent Management identifies, develops, and retains top performers through performance management, succession planning, and career development programs. The system provides 360-degree feedback, goal setting and tracking, and competency assessments. Key capabilities include talent pool analysis, high-potential identification, and development planning with training recommendations.',

      // Manufacturing Module
      'manufacturing': 'Manufacturing in SAP S/4HANA integrates production planning, execution, and quality management with real-time visibility into manufacturing operations. The system supports discrete, process, and repetitive manufacturing scenarios with advanced planning optimization and shop floor integration. Key features include material requirements planning, capacity planning, and production order management.',
      'Production Management': 'Production Management handles the complete production lifecycle from planning through execution and completion. The system creates production orders based on demand, allocates materials and capacity, and tracks progress in real-time. Advanced features include production scheduling optimization, shop floor data collection, and integration with quality management for in-process inspections.',
      'Quality Management': 'Quality Management ensures product quality through inspection planning, quality control during production, and statistical quality analysis. The system defines quality plans, captures inspection results, and triggers corrective actions for non-conformities. Key capabilities include certificate management, supplier quality monitoring, and continuous improvement through quality analytics.',

      // Supply Chain Module
      'supply-chain': 'Supply Chain Management in SAP S/4HANA provides end-to-end visibility and control over supply chain operations including demand planning, inventory management, warehouse management, and transportation management. The system uses advanced analytics and machine learning for demand forecasting and supply optimization.',
      'Inventory Management': 'Inventory Management optimizes stock levels while minimizing carrying costs through automated reorder point calculations, safety stock optimization, and ABC analysis. The system tracks inventory movements in real-time, supports multiple valuation methods, and provides cycle counting capabilities. Advanced features include consignment inventory management and vendor-managed inventory programs.',
      'Demand Planning': 'Demand Planning uses statistical forecasting and machine learning algorithms to predict future demand patterns. The system considers historical data, market trends, and external factors to generate accurate forecasts. Key capabilities include collaborative planning with customers and suppliers, demand sensing for short-term adjustments, and forecast accuracy monitoring.',

      // Sales Module
      'sales': 'Sales in SAP S/4HANA covers the complete order-to-cash process including customer management, quotation processing, sales order management, pricing, billing, and credit management. The system provides real-time sales analytics, territory management, and commission tracking. Advanced features include contract management, sales returns processing, and integrated CRM functionality for comprehensive customer relationship management.',
      'Sales Orders Management': 'Sales Orders represent customer commitments to purchase goods or services. The process includes order creation from quotations, availability checking, pricing determination, delivery scheduling, and order fulfillment tracking. Key features include ATP (Available-to-Promise) checking, automatic pricing procedures, delivery block management, and integration with production planning and logistics.',
      'Quotation Management': 'Quotation Management handles the creation, tracking, and conversion of sales quotations to orders. The system supports multiple quotation types, validity periods, and follow-up activities. Features include quotation templates, competitive analysis, probability tracking, and automated conversion processes with pricing inheritance.',
      'Customer Management': 'Customer Management maintains comprehensive customer master data including contact information, credit limits, payment terms, and sales area assignments. The system supports customer hierarchy management, account segmentation, and customer lifecycle tracking. Integration with CRM provides 360-degree customer views and interaction history.',
      'Billing Documents Management': 'Billing Documents encompass invoice creation, credit memo processing, and billing schedule management. The system automates invoice generation from deliveries, handles complex billing scenarios, and supports revenue recognition requirements. Features include collective billing, milestone billing, and automated posting to financial accounting.',
      'Credit Management': 'Credit Management monitors customer credit exposure and automates credit decisions based on predefined rules. The system performs real-time credit checks during order processing, manages credit limits, and provides early warning alerts. Advanced features include credit scoring, risk assessment, and automated credit block/release processes.',
      'Territory Management': 'Territory Management defines and manages sales territories based on geographic, industry, or account criteria. The system supports territory assignment rules, performance tracking, and realignment processes. Features include territory optimization, quota assignment, and performance analytics by territory and sales representative.',
      'Commission Management': 'Commission Management calculates and tracks sales representative commissions based on configurable plans and achievement criteria. The system supports multiple commission structures, tier-based calculations, and bonus schemes. Features include automated commission runs, payment processing, and comprehensive commission reporting.',
      'Sales Returns Management': 'Sales Returns handle the complete returns process including return authorization, credit memo creation, and inventory processing. The system manages return reasons, approval workflows, and refund processing. Features include return analytics, quality inspection integration, and automated accounting postings.',
      'Sales Contracts Management': 'Sales Contracts manage long-term customer agreements including framework contracts, value contracts, and scheduling agreements. The system tracks contract terms, delivery schedules, and contract utilization. Features include contract release strategies, automatic purchase order generation, and contract performance monitoring.',

      // Business Intelligence Module
      'business-intelligence': 'Business Intelligence in SAP S/4HANA provides real-time analytics and reporting capabilities with embedded analytics directly in business processes. The system offers self-service analytics, predictive modeling, and interactive dashboards. Key features include drill-down analysis, what-if scenarios, and mobile analytics for decision-making on the go.',
      'Predictive Analytics': 'Predictive Analytics leverages machine learning and AI to forecast future trends and identify potential risks and opportunities. The system analyzes historical data patterns to predict customer behavior, demand fluctuations, and operational performance. Advanced capabilities include anomaly detection, predictive maintenance, and automated model training and deployment.',
      'Real-time Analytics': 'Real-time Analytics processes data streams as they occur, providing instant insights for immediate decision-making. The system monitors key performance indicators, triggers alerts for threshold violations, and enables rapid response to changing business conditions. Key features include live dashboards, streaming analytics, and event-driven automation.'
    };
    
    return contentMap[module] || 'This module provides comprehensive functionality for managing business processes in SAP S/4HANA with advanced workflow automation, real-time analytics, and integrated business intelligence capabilities.';
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    teachAbout,
    generateEducationalContent
  };
};
