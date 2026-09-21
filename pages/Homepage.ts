import {Page, Locator, expect} from "@playwright/test";

export enum EventCategory {
  Conference = 'Conference',
  Concert = 'Concert',
  Sports = 'Sports',
  Workshop = 'Workshop',
  Festival = 'Festival'
}


export class HomePage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly logOutButton: Locator;
    readonly eventCard: Locator;
    readonly bookNowButton: Locator;
    readonly bookTicketsText: Locator;
    readonly bookingName: Locator;
    readonly bookingMail: Locator;
    readonly bookingPhone: Locator;
    readonly confirmBookingButton: Locator;
    readonly bookingConfirmed: Locator;
    readonly increaseTicketsButton: Locator;
    readonly decreaseTicketsButton: Locator;
    readonly ticketCount: Locator;
    readonly maxTickets: Locator;
    readonly menuEvents: Locator;
    readonly addNewEventButton: Locator;
    readonly eventTitleInput: Locator;
    readonly eventCategorySelect: Locator;
    readonly eventCityInput: Locator;
    readonly eventVenueInput: Locator;
    readonly eventDateTime: Locator;
    readonly eventPriceInput: Locator;
    readonly eventTotalSeats: Locator;
    readonly eventAddConfiration: Locator;
    readonly newEventName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.signInButton = page.getByRole("button", {name: "Sign In"});
        this.logOutButton = page.getByRole("button", {name: "Logout"});
        this.eventCard = page.locator("#event-card");
        this.bookNowButton = page.locator("#book-now-btn");
        this.bookTicketsText = page.getByRole("heading", { name: 'Book Tickets' });
        this.bookingName = page.locator("#customerName");
        this.bookingMail = page.locator("#customer-email");
        this.bookingPhone = page.locator("#phone");
        this.confirmBookingButton = page.getByRole("button", {name: "Confirm Booking"});
        this.bookingConfirmed = page.getByRole('heading', { name: 'Booking Confirmed!' });
        this.increaseTicketsButton = page.getByRole('button', { name: '+' });
        this.decreaseTicketsButton = page.getByRole('button', { name: '−' });
        this.ticketCount = page.locator("#ticket-count");
        this.maxTickets = page.getByText('max ');
        this.menuEvents = page.locator("#nav-events");
        this.addNewEventButton = page.getByRole('button', { name: 'Add New Event' });
        this.eventTitleInput = page.getByPlaceholder("Event title");
        this.eventCategorySelect = page.locator("#category");
        this.eventCityInput = page.locator("#city");
        this.eventVenueInput = page.locator("#venue");
        this.eventDateTime = page.getByRole('textbox', { name: 'Event Date & Time*' });
        this.eventPriceInput = page.getByRole('spinbutton', { name: 'Price ($)*' });
        this.eventTotalSeats = page.locator("#total-seats");
        this.eventAddConfiration = page.locator("#add-event-btn");
        this.newEventName = page.getByRole('cell');
    }

    async goto() {
        await this.page.goto('https://eventhub.rahulshettyacademy.com/');
    }

    async login(username: string, password: string) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async bookEvent(eventName: string, tickets: number = 1) {
        const seatsLeft = await this.eventCard.filter({hasText : eventName}).locator("span", {hasText: 'seats available'}).textContent();

        await this.eventCard.filter({hasText: eventName}).locator('#book-now-btn').click();
        await expect(this.bookTicketsText).toBeVisible();

        const maxTicketCount = await this.maxTickets.textContent();
        const maxTicketNumber = Number(maxTicketCount?.split(" ")[1].replace(")",""));

        await this.increaseTicketsButton.click({clickCount: tickets-1});
        if (tickets > maxTicketNumber) {
            expect(Number(await this.ticketCount.textContent()) === maxTicketNumber).toBeTruthy();
        } else {
            expect(Number(await this.ticketCount.textContent()) === tickets).toBeTruthy();
        }

        await this.bookingName.fill("Georgi Ivanov");
        await this.bookingMail.fill("georgi.n.ivanov@gmail.com");
        await this.bookingPhone.fill("+359888123456");
        await this.confirmBookingButton.click();

        await expect(this.bookingConfirmed).toBeVisible();

        return Number(seatsLeft?.split(" ")[0]);
    }

    async createNewEvent(title: string, category: EventCategory,
                        city: string, address: string,
                        dateTime: string, price: string,
                        seats: string) {
        await this.menuEvents.click();
        await this.addNewEventButton.click();
        await this.eventTitleInput.fill(title);
        await this.eventCategorySelect.selectOption(category);
        await this.eventCityInput.fill(city);
        await this.eventVenueInput.fill(address);
        await this.eventDateTime.fill(dateTime);
        await this.eventPriceInput.fill(price);
        await this.eventTotalSeats.fill(seats);
        await this.eventAddConfiration.click();
    }
}