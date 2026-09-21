import { test, expect } from '@playwright/test';
import { EventCategory, HomePage } from '../pages/Homepage';

test('login successful', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();
  await homePage.login("georgi.n.ivanov@gmail.com","Password!23");
  expect(await homePage.logOutButton.isVisible());
})

test('booking an event reduces seats left', async ({ page }) => {
  const homePage = new HomePage(page);
  const eventName = "Dilli Diwali Mela"
  const ticketCount = 6

  await homePage.goto();
  await homePage.login("georgi.n.ivanov@gmail.com","Password!23");
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