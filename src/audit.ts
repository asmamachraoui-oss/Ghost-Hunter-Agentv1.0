
class AuditLog {
  private logs: any[] = [];

  public log(entry: any) {
    const enriched = {
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.logs.push(enriched);
    console.log("AUDIT EVENT:", JSON.stringify(enriched));
    // In a real Node app, we would:
    // fs.appendFileSync('logs/audit.log.jsonl', JSON.stringify(enriched) + '\n');
  }

  public getLogs() {
    return this.logs;
  }
}

export const auditLog = new AuditLog();
