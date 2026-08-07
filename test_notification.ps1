$supabaseUrl = "https://mrqzlmkdhzwvbpljikjz.supabase.co"
$serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA"

$headers = @{
    "Authorization" = "Bearer $serviceRoleKey"
    "Content-Type"  = "application/json"
}

$body = @{
    type = "INVOICE_READY"
    to   = "unlymitedsoundz@gmail.com"
    additionalData = @{
        amount      = 2500
        currency    = "EUR"
        invoiceType = "Tuition Deposit"
        dueDate     = "17 April 2026"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$supabaseUrl/functions/v1/send-notification" -Method Post -Headers $headers -Body $body
    Write-Output "Response: $($response | ConvertTo-Json)"
} catch {
    Write-Error "Failed to invoke function: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $respBody = $reader.ReadToEnd()
        Write-Output "Error Body: $respBody"
    }
}
