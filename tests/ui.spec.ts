import { test, expect, request } from '@playwright/test';
import { EventCategory, HomePage } from '../pages/Homepage';

const loginPayload = {
      email: "georgi.n.ivanov@gmail.com",
      password: "Password!23"
    }
let token: string;

test.beforeAll('API login successfully', async () => {

  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post('https://api.eventhub.rahulshettyacademy.com/api/auth/login', {
    data: loginPayload
  });

  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseJson = await loginResponse.json();
  token = loginResponseJson.token;

})

test('UI Login successfully', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.login("georgi.n.ivanov@gmail.com", "Password!23");
  await expect(homePage.logOutButton).toBeVisible();
});

test('booking an event reduces seats left', async ({ page }) => {
  const homePage = new HomePage(page);
  const eventName = "Dilli Diwali Mela"
  const ticketCount = 6;

  await homePage.setToken(token);
  await homePage.goto();
  
  const seatsLeftOld = await homePage.bookEvent(eventName, ticketCount);

  await homePage.goto();

  if (seatsLeftOld > ticketCount) {
    const seatsLeftNew = Number((await homePage.eventCard.filter({hasText : eventName}).locator("span", {hasText: 'seats available'}).textContent())?.split(" ")[0]);
    expect(seatsLeftNew+ticketCount===seatsLeftOld).toBeTruthy();
  } else {
    expect(await homePage.eventCard.filter({hasText: eventName}).locator(".text-red-600").textContent()).toBe("SOLD OUT");
  }  
})

test('create new event', async ({ page }) => {

  const homePage = new HomePage(page);

  const title = "New Test Event";
  const category = EventCategory.Workshop;
  const city= "Sofia"; 
  const address = "Address 23";
  const dateTime = "2026-12-01T09:30";
  const price = "500";
  const seats = "20";

  await homePage.goto();
  await homePage.login("georgi.n.ivanov@gmail.com","Password!23");
  await homePage.createNewEvent(title, category, city, address, dateTime, price, seats);
  expect(await homePage.newEventName.filter({ hasText: title}).isVisible());
})

test('cancel oldest booking', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.setToken(token);
  await homePage.goto();

  await homePage.myBookingsButton.click();
  await expect(homePage.bookingCard.first()).toBeVisible();

  const firstOldestBookingID = await homePage.getLastBookingID();
  await homePage.cancelLastBooking();
  const secondOldestBookingID = await homePage.getLastBookingID();
  expect(firstOldestBookingID !== secondOldestBookingID).toBeTruthy();
})