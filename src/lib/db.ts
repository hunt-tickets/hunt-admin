import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export { pool }

// Producer interface moved to types/producer.ts to avoid duplication
import type { Producer } from '@/types/producer';

export interface SocialMediaLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  tiktok?: string;
  linkedin?: string;
  spotify?: string;
  soundcloud?: string;
}

export interface ProducerTerms {
  id: string;
  producer_id: string;
  terms_and_conditions?: string;
  privacy_policy?: string;
  refund_policy?: string;
  created_at: string;
  updated_at: string;
}

// Types for currencies and countries based on backend schema
export interface Currency {
  id: string;
  code: string;
  name: any; // JSON type for multiple languages
  symbol: string;
  decimal_places: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  phone_prefix: string;
  default_currency_id: string | null;
  is_active: boolean | null;
  whatsapp_support_phone: string | null;
  support_email: string | null;
  privacy_policy_url: string | null;
  refund_policy_url: string | null;
  terms_of_service_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Invoice {
  id: string;
  company_name: string;
  description?: string;
  subtotal: number;
  tax: number;
  total: number;
  invoice_to: string;
  currency: string;
  payment_method?: string;
  paid_at?: string;
  ignore?: boolean; // Para pagos externos que se deben ignorar en analytics
  metadata: any; // JSONB type
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  static async getProducers(): Promise<Producer[]> {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT id, name, description, url, created_at, updated_at FROM producers ORDER BY id DESC')
      return result.rows
    } finally {
      client.release()
    }
  }

  static async getProducerById(id: string): Promise<Producer> {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT id, name, description, url, created_at, updated_at FROM producers WHERE id = $1', [id])
      if (result.rows.length === 0) {
        throw new Error('Producer not found')
      }
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async updateProducerSocialMedia(producerId: string, socialLinks: SocialMediaLinks): Promise<void> {
    const client = await pool.connect()
    try {
      // First check if record exists
      const existing = await client.query(
        'SELECT id FROM producers_social_media WHERE producer_id = $1',
        [producerId]
      )
      
      if (existing.rows.length > 0) {
        // Update existing record
        await client.query(
          `UPDATE producers_social_media SET 
           website = $2, instagram = $3, facebook = $4, x = $5,
           tiktok = $6, linkedin = $7, spotify = $8, soundcloud = $9,
           updated_at = NOW()
           WHERE producer_id = $1`,
          [
            producerId,
            socialLinks.website,
            socialLinks.instagram, 
            socialLinks.facebook,
            socialLinks.x,
            socialLinks.tiktok,
            socialLinks.linkedin,
            socialLinks.spotify,
            socialLinks.soundcloud
          ]
        )
      } else {
        // Insert new record
        await client.query(
          `INSERT INTO producers_social_media (producer_id, website, instagram, facebook, x, tiktok, linkedin, spotify, soundcloud, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
          [
            producerId,
            socialLinks.website,
            socialLinks.instagram,
            socialLinks.facebook,
            socialLinks.x,
            socialLinks.tiktok,
            socialLinks.linkedin,
            socialLinks.spotify,
            socialLinks.soundcloud
          ]
        )
      }
    } finally {
      client.release()
    }
  }

  static async getProducerSocialMedia(producerId: string): Promise<SocialMediaLinks | null> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT website, instagram, facebook, x, tiktok, linkedin, spotify, soundcloud FROM producers_social_media WHERE producer_id = $1',
        [producerId]
      )
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  static async createProducer(producer: Omit<Producer, 'id'>): Promise<Producer> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO producers (name, description)
         VALUES ($1, $2)
         RETURNING id, name, description`,
        [producer.name, producer.description]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async updateProducer(id: string, updates: Partial<Omit<Producer, 'id'>>): Promise<Producer> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `UPDATE producers SET 
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         url = COALESCE($4, url),
         updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, description, url, created_at, updated_at`,
        [id, updates.name, updates.description, updates.url]
      )
      
      if (result.rows.length === 0) {
        throw new Error('Producer not found')
      }
      
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async deleteProducer(id: string): Promise<boolean> {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM producers WHERE id = $1', [id])
      return result.rowCount! > 0
    } finally {
      client.release()
    }
  }

  static async testConnection(): Promise<boolean> {
    const client = await pool.connect()
    try {
      await client.query('SELECT 1')
      return true
    } finally {
      client.release()
    }
  }

  // Producer Terms/Policies methods
  static async getProducerTerms(producerId: string): Promise<ProducerTerms | null> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT id, producer_id, terms_and_conditions, privacy_policy, refund_policy, created_at, updated_at FROM producers_terms WHERE producer_id = $1',
        [producerId]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error('Database error in getProducerTerms:', error)
      // Check if it's a "relation does not exist" error
      if (error instanceof Error && error.message.includes('relation "producers_terms" does not exist')) {
        throw new Error('producers_terms table does not exist. Please run the database migration first.')
      }
      throw error
    } finally {
      client.release()
    }
  }

  static async updateProducerTerms(producerId: string, terms: Partial<Pick<ProducerTerms, 'terms_and_conditions' | 'privacy_policy' | 'refund_policy'>>): Promise<ProducerTerms> {
    const client = await pool.connect()
    try {
      console.log('updateProducerTerms called with:', { producerId, terms })
      
      // First check if record exists
      const existing = await client.query(
        'SELECT id FROM producers_terms WHERE producer_id = $1',
        [producerId]
      )
      
      if (existing.rows.length > 0) {
        console.log('Updating existing record')
        // Update existing record
        const result = await client.query(
          `UPDATE producers_terms SET 
           terms_and_conditions = COALESCE($2, terms_and_conditions),
           privacy_policy = COALESCE($3, privacy_policy),
           refund_policy = COALESCE($4, refund_policy),
           updated_at = NOW()
           WHERE producer_id = $1
           RETURNING id, producer_id, terms_and_conditions, privacy_policy, refund_policy, created_at, updated_at`,
          [
            producerId,
            terms.terms_and_conditions,
            terms.privacy_policy,
            terms.refund_policy
          ]
        )
        return result.rows[0]
      } else {
        console.log('Inserting new record')
        // Insert new record
        const result = await client.query(
          `INSERT INTO producers_terms (producer_id, terms_and_conditions, privacy_policy, refund_policy, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())
           RETURNING id, producer_id, terms_and_conditions, privacy_policy, refund_policy, created_at, updated_at`,
          [
            producerId,
            terms.terms_and_conditions,
            terms.privacy_policy,
            terms.refund_policy
          ]
        )
        return result.rows[0]
      }
    } catch (error) {
      console.error('Database error in updateProducerTerms:', error)
      // Check if it's a "relation does not exist" error
      if (error instanceof Error && error.message.includes('relation "producers_terms" does not exist')) {
        throw new Error('producers_terms table does not exist. Please run the database migration first.')
      }
      throw error
    } finally {
      client.release()
    }
  }

  static async createProducerTerms(producerId: string, terms: Partial<Pick<ProducerTerms, 'terms_and_conditions' | 'privacy_policy' | 'refund_policy'>>): Promise<ProducerTerms> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO producers_terms (producer_id, terms_and_conditions, privacy_policy, refund_policy, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, producer_id, terms_and_conditions, privacy_policy, refund_policy, created_at, updated_at`,
        [
          producerId,
          terms.terms_and_conditions,
          terms.privacy_policy,
          terms.refund_policy
        ]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async deleteProducerTerms(producerId: string): Promise<boolean> {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM producers_terms WHERE producer_id = $1', [producerId])
      return result.rowCount! > 0
    } finally {
      client.release()
    }
  }

  // Currencies CRUD methods
  static async getCurrencies(): Promise<Currency[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT id, code, name, symbol, decimal_places, is_active, created_at, updated_at FROM currencies ORDER BY code'
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  static async getCurrencyById(id: string): Promise<Currency> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT id, code, name, symbol, decimal_places, is_active, created_at, updated_at FROM currencies WHERE id = $1',
        [id]
      )
      if (result.rows.length === 0) {
        throw new Error('Currency not found')
      }
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async createCurrency(currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>): Promise<Currency> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO currencies (code, name, symbol, decimal_places, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, code, name, symbol, decimal_places, is_active, created_at, updated_at`,
        [currency.code, currency.name, currency.symbol, currency.decimal_places, currency.is_active]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async updateCurrency(id: string, updates: Partial<Omit<Currency, 'id' | 'created_at' | 'updated_at'>>): Promise<Currency> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `UPDATE currencies SET 
         code = COALESCE($2, code),
         name = COALESCE($3, name),
         symbol = COALESCE($4, symbol),
         decimal_places = COALESCE($5, decimal_places),
         is_active = COALESCE($6, is_active),
         updated_at = NOW()
         WHERE id = $1
         RETURNING id, code, name, symbol, decimal_places, is_active, created_at, updated_at`,
        [id, updates.code, updates.name, updates.symbol, updates.decimal_places, updates.is_active]
      )
      
      if (result.rows.length === 0) {
        throw new Error('Currency not found')
      }
      
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async deleteCurrency(id: string): Promise<boolean> {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM currencies WHERE id = $1', [id])
      return result.rowCount! > 0
    } finally {
      client.release()
    }
  }

  // Countries CRUD methods
  static async getCountries(): Promise<Country[]> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT id, name, code, phone_prefix, default_currency_id, is_active, whatsapp_support_phone, support_email, privacy_policy_url, refund_policy_url, terms_of_service_url, created_at, updated_at FROM countries ORDER BY name'
      )
      return result.rows
    } finally {
      client.release()
    }
  }

  static async getCountryById(id: string): Promise<Country> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT id, name, code, phone_prefix, default_currency_id, is_active, whatsapp_support_phone, support_email, privacy_policy_url, refund_policy_url, terms_of_service_url, created_at, updated_at FROM countries WHERE id = $1',
        [id]
      )
      if (result.rows.length === 0) {
        throw new Error('Country not found')
      }
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async createCountry(country: Omit<Country, 'id' | 'created_at' | 'updated_at'>): Promise<Country> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO countries (name, code, phone_prefix, default_currency_id, is_active, whatsapp_support_phone, support_email, privacy_policy_url, refund_policy_url, terms_of_service_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, name, code, phone_prefix, default_currency_id, is_active, whatsapp_support_phone, support_email, privacy_policy_url, refund_policy_url, terms_of_service_url, created_at, updated_at`,
        [country.name, country.code, country.phone_prefix, country.default_currency_id, country.is_active, country.whatsapp_support_phone, country.support_email, country.privacy_policy_url, country.refund_policy_url, country.terms_of_service_url]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async updateCountry(id: string, updates: Partial<Omit<Country, 'id' | 'created_at' | 'updated_at'>>): Promise<Country> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `UPDATE countries SET 
         name = COALESCE($2, name),
         code = COALESCE($3, code),
         phone_prefix = COALESCE($4, phone_prefix),
         default_currency_id = COALESCE($5, default_currency_id),
         is_active = COALESCE($6, is_active),
         whatsapp_support_phone = COALESCE($7, whatsapp_support_phone),
         support_email = COALESCE($8, support_email),
         privacy_policy_url = COALESCE($9, privacy_policy_url),
         refund_policy_url = COALESCE($10, refund_policy_url),
         terms_of_service_url = COALESCE($11, terms_of_service_url),
         updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, code, phone_prefix, default_currency_id, is_active, whatsapp_support_phone, support_email, privacy_policy_url, refund_policy_url, terms_of_service_url, created_at, updated_at`,
        [id, updates.name, updates.code, updates.phone_prefix, updates.default_currency_id, updates.is_active, updates.whatsapp_support_phone, updates.support_email, updates.privacy_policy_url, updates.refund_policy_url, updates.terms_of_service_url]
      )
      
      if (result.rows.length === 0) {
        throw new Error('Country not found')
      }
      
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async deleteCountry(id: string): Promise<boolean> {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM countries WHERE id = $1', [id])
      return result.rowCount! > 0
    } finally {
      client.release()
    }
  }

  // Invoices CRUD methods
  static async getInvoices(): Promise<Invoice[]> {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM invoices ORDER BY created_at DESC')
      return result.rows
    } finally {
      client.release()
    }
  }

  static async getInvoiceById(id: string): Promise<Invoice> {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT * FROM invoices WHERE id = $1', [id])
      if (result.rows.length === 0) {
        throw new Error('Invoice not found')
      }
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `INSERT INTO invoices (company_name, description, subtotal, tax, total, invoice_to, currency, payment_method, paid_at, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         RETURNING *`,
        [
          invoice.company_name,
          invoice.description,
          invoice.subtotal,
          invoice.tax,
          invoice.total,
          invoice.invoice_to,
          invoice.currency,
          invoice.payment_method,
          invoice.paid_at,
          invoice.metadata || {}
        ]
      )
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async updateInvoice(id: string, updates: Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at'>>): Promise<Invoice> {
    const client = await pool.connect()
    try {
      const result = await client.query(
        `UPDATE invoices SET 
         company_name = COALESCE($2, company_name),
         description = COALESCE($3, description),
         subtotal = COALESCE($4, subtotal),
         tax = COALESCE($5, tax),
         total = COALESCE($6, total),
         invoice_to = COALESCE($7, invoice_to),
         currency = COALESCE($8, currency),
         payment_method = COALESCE($9, payment_method),
         paid_at = COALESCE($10, paid_at),
         metadata = COALESCE($11, metadata),
         updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [
          id,
          updates.company_name,
          updates.description,
          updates.subtotal,
          updates.tax,
          updates.total,
          updates.invoice_to,
          updates.currency,
          updates.payment_method,
          updates.paid_at,
          updates.metadata
        ]
      )
      
      if (result.rows.length === 0) {
        throw new Error('Invoice not found')
      }
      
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  static async deleteInvoice(id: string): Promise<boolean> {
    const client = await pool.connect()
    try {
      const result = await client.query('DELETE FROM invoices WHERE id = $1', [id])
      return result.rowCount! > 0
    } finally {
      client.release()
    }
  }
}