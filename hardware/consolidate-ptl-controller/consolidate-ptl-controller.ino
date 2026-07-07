// ConsolidAte — single-ESP32 PTL light controller
// ---------------------------------------------------------------------------
// ONE ESP32 drives ALL racks. The LEDs are a single WS2812 series chain and
// each PTL slot uses 2 LEDs. The NexS Ascend backend addresses a slot by its
// GLOBAL location number (1..SLOTS) and this firmware lights that slot's 2 LEDs:
//     slot N  ->  LEDs (N-1)*2  and  (N-1)*2 + 1
//
// API (matches src/utils/rackController.ts):
//   POST /light  { "location": <1..SLOTS>, "color": "YELLOW|BLUE|GREEN|PINK|RED|OFF" }
//   POST /reset  {}
//
// Slot numbering convention (wire the chain to match, or remap below):
//   location = (rack-1)*25 + (row-1)*5 + col   // rack 1..N, row 1..5 top->bottom, col 1..5 left->right
//   Slot 1 = Rack 1, top-left. Raise SLOTS as racks are added (25 per rack).

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>

#define LED_PIN        16
#define SLOTS          100          // 4 racks x 25; increase as racks are added
#define LEDS_PER_SLOT  2
#define LED_COUNT      (SLOTS * LEDS_PER_SLOT)

const char* ssid     = "LKS_Bhiwadi_Plant";
const char* password = "Lensk@101*";

WebServer server(80);
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

uint32_t getColor(String color) {
  color.toUpperCase();
  if (color == "YELLOW") return strip.Color(255, 200, 0);
  if (color == "BLUE")   return strip.Color(0, 0, 255);
  if (color == "GREEN")  return strip.Color(0, 255, 0);
  if (color == "PINK")   return strip.Color(255, 20, 147);
  if (color == "RED")    return strip.Color(255, 0, 0);
  return strip.Color(0, 0, 0); // OFF / unknown
}

void handleLight() {
  if (server.method() != HTTP_POST) {
    server.send(405, "text/plain", "Method Not Allowed");
    return;
  }

  StaticJsonDocument<200> doc;
  if (deserializeJson(doc, server.arg("plain"))) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  int location = doc["location"] | 0;
  String color = doc["color"] | "OFF";

  if (location < 1 || location > SLOTS) {
    server.send(400, "application/json", "{\"error\":\"Invalid location\"}");
    return;
  }

  int led0 = (location - 1) * LEDS_PER_SLOT;
  uint32_t c = getColor(color);
  for (int i = 0; i < LEDS_PER_SLOT; i++) {
    strip.setPixelColor(led0 + i, c);
  }
  strip.show();

  Serial.printf("slot %d -> LEDs %d,%d = %s\n", location, led0, led0 + 1, color.c_str());
  server.send(200, "application/json", "{\"success\":true}");
}

void handleReset() {
  for (int i = 0; i < LED_COUNT; i++) strip.setPixelColor(i, strip.Color(0, 0, 0));
  strip.show();
  server.send(200, "application/json", "{\"reset\":true}");
}

void setup() {
  Serial.begin(115200);
  strip.begin();
  strip.setBrightness(80);   // 0-255
  strip.show();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 30) { delay(500); Serial.print("."); retry++; }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("\nIP: "); Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi failed");
  }

  server.on("/light", handleLight);
  server.on("/reset", handleReset);
  server.begin();
  Serial.println("ConsolidAte PTL controller ready");
}

void loop() {
  server.handleClient();
}
