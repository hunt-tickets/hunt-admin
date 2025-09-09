"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Bot, Upload, FileText, CheckCircle2, Loader2, X, AlertTriangle } from "lucide-react"
import { Invoice } from "@/lib/db"
import { useInvoicesContext } from "@/contexts/invoices-context"

interface AIInvoiceUploadProps {
  onSuccess: (invoice: Invoice) => void
  onCancel: () => void
}

interface ProcessingStep {
  id: string
  name: string
  status: 'waiting' | 'processing' | 'completed' | 'error'
  message: string
}

interface UploadResult {
  success: boolean
  fileName?: string
  url?: string
  uuid?: string
  error?: string
}

export function AIInvoiceUpload({ onSuccess, onCancel }: AIInvoiceUploadProps) {
  const { createInvoice } = useInvoicesContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState<string>("")
  const [error, setError] = useState<string>("")
  
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'upload', name: 'Subir archivo', status: 'waiting', message: 'Esperando...' },
    { id: 'ai', name: 'Procesar con AI', status: 'waiting', message: 'Esperando...' }
  ])

  const updateStepStatus = (stepId: string, status: ProcessingStep['status'], message: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message } : step
    ))
  }

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    // Check file size
    if (file.size > maxSize) {
      setError(`"${file.name}" es demasiado grande. Máximo 5MB permitido.`)
      return false
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      setError(`"${file.name}" no es un tipo de archivo válido. Solo PDF, JPG y PNG permitidos.`)
      return false
    }
    
    // Check for suspicious filenames
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      setError(`"${file.name}" contiene caracteres no permitidos.`)
      return false
    }
    
    return true
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles: File[] = []
    
    setError("")
    
    for (const file of files) {
      if (validateFile(file)) {
        validFiles.push(file)
      } else {
        return // Error already set in validateFile
      }
    }
    
    setSelectedFiles(validFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const mockEvent = { target: { files } } as any
    handleFileSelect(mockEvent)
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      setError("Por favor selecciona al menos un archivo")
      return
    }

    setIsProcessing(true)
    setError("")
    setProgress(0)
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setCurrentFile(file.name)
        
        // Step 1: Upload file
        updateStepStatus('upload', 'processing', 'Subiendo archivo...')
        
        const uploadResult = await uploadFile(file)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Error subiendo archivo')
        }
        
        updateStepStatus('upload', 'completed', 'Archivo subido correctamente')
        setProgress(50)
        
        // Step 2: AI Processing y guardado (el webhook hace todo)
        updateStepStatus('ai', 'processing', 'Procesando con AI y guardando...')
        
        const aiResult = await processWithAI(uploadResult.url!, uploadResult.uuid!)
        if (!aiResult.success) {
          throw new Error('Error procesando con AI')
        }
        
        updateStepStatus('ai', 'completed', 'Procesamiento completado')
        setProgress(100)
        
        // Success - el webhook ya creó el invoice, solo necesitamos refrescar la lista
        setTimeout(() => {
          // Crear un objeto mock para mantener compatibilidad con la interfaz
          const mockInvoice = {
            id: aiResult.uuid || 'new-invoice',
            company_name: 'Procesado con AI',
            description: 'Factura procesada automáticamente',
            subtotal: 0,
            tax: 0,
            total: 0,
            invoice_to: 'Hunt Tickets',
            currency: 'USD',
            payment_method: '',
            paid_at: null,
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          onSuccess(mockInvoice)
        }, 1500)
        
        return
      }
      
    } catch (error) {
      console.error('Error processing files:', error)
      setError(error instanceof Error ? error.message : 'Error procesando archivos')
      
      // Mark current step as error
      const currentStep = steps.find(s => s.status === 'processing')
      if (currentStep) {
        updateStepStatus(currentStep.id, 'error', 'Error en el procesamiento')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const uploadFile = async (file: File): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/invoices/ai-upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${errorText}`)
    }
    
    return await response.json()
  }

  const processWithAI = async (fileUrl: string, uuid: string): Promise<{ success: boolean; data: any }> => {
    const response = await fetch('/api/invoices/ai-process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileUrl,
        uuid
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`AI processing failed: ${errorText}`)
    }
    
    return await response.json()
  }

  const resetForm = () => {
    setSelectedFiles([])
    setProgress(0)
    setCurrentFile("")
    setError("")
    setSteps([
      { id: 'upload', name: 'Subir archivo', status: 'waiting', message: 'Esperando...' },
      { id: 'ai', name: 'Procesar con AI', status: 'waiting', message: 'Esperando...' }
    ])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <SheetContent className="sm:max-w-[600px] overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-interactive-primary" />
          Subir Factura con AI
        </SheetTitle>
      </SheetHeader>

      <div className="space-y-6 py-6">
        {!isProcessing ? (
          <>
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="text-sm text-text-secondary">
                Sube tu factura en formato PDF o imagen. El AI extraerá automáticamente los datos necesarios.
              </div>
              
              <div 
                className="border-2 border-dashed border-border-secondary rounded-lg p-8 text-center hover:border-border-primary transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <p className="text-sm text-text-secondary mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-text-secondary mb-4">
                  PDF, JPG, PNG (máximo 5MB)
                </p>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Seleccionar archivos
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-primary">Archivos seleccionados:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-text-secondary" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{file.name}</p>
                          <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-status-error/10 border border-status-error/20 rounded-lg text-status-error">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Processing Section */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-text-primary mb-2">Procesando factura</h3>
              {currentFile && (
                <p className="text-sm text-text-secondary">Procesando: {currentFile}</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Progreso</span>
                <span className="text-text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Processing Steps */}
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {step.status === 'waiting' && (
                      <div className="w-6 h-6 rounded-full border-2 border-border-secondary" />
                    )}
                    {step.status === 'processing' && (
                      <Loader2 className="w-6 h-6 animate-spin text-interactive-primary" />
                    )}
                    {step.status === 'completed' && (
                      <CheckCircle2 className="w-6 h-6 text-status-success" />
                    )}
                    {step.status === 'error' && (
                      <AlertTriangle className="w-6 h-6 text-status-error" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{step.name}</p>
                    <p className="text-xs text-text-secondary">{step.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SheetFooter>
        <Button 
          variant="outline" 
          onClick={() => {
            resetForm()
            onCancel()
          }}
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        {!isProcessing && (
          <Button 
            onClick={processFiles}
            disabled={selectedFiles.length === 0}
            className="bg-interactive-primary text-text-inverse hover:bg-interactive-active"
          >
            <Bot className="w-4 h-4 mr-2" />
            Procesar con AI
          </Button>
        )}
      </SheetFooter>
    </SheetContent>
  )
}