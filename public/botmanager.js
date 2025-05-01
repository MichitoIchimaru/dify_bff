class BotManager {
  constructor() {
    this.url = "/api/v1/chat-messages"
    this.messageId = null
    this.conversationId = null
    this.headers = { "Content-Type": "application/json" }
  }

  async query(message) {
    const req = {}
    if (this.messageId) req["message_id"] = this.messageId
    if (this.conversationId) req["conversation_id"] = this.conversationId
    req.query = message
    const res = await fetch(this.url, {
      method: "POST",
      body: JSON.stringify(req),
      headers: this.headers
    })
    const data = await res.json()
    if (res.ok) {
      this.messageId = data["message_id"]
      this.conversationId = data["conversation_id"]
    }
    return data.answer
  }

  refresh() {
    this.messageId = null
    this.conversationId = null
  }
}