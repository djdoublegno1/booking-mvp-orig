import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, CircleDollarSign, FileText, MapPinned, Search, Users, Building2, Plus, AlertTriangle } from "lucide-react";

const initialArtists = [
  { id: 1, name: "Scooter", feeRange: "€150k–€250k", territories: "DE, Scandinavia, CEE", notes: "Strong arena/festival draw" },
  { id: 2, name: "Example Artist", feeRange: "€35k–€60k", territories: "EU", notes: "Club / mid-size halls" },
];

const initialPromoters = [
  { id: 1, company: "Live Nation", contact: "Booking Team", email: "booking@example.com", phone: "+44 20 0000 0000", territories: "UK / IE", reliability: "High", notes: "Fast response times" },
  { id: 2, company: "All Things Live", contact: "Regional Booker", email: "atl@example.com", phone: "+45 00 0000 0000", territories: "Nordics / Europe", reliability: "High", notes: "Good routing partner" },
];

const initialOffers = [
  {
    id: 1,
    artist: "Scooter",
    city: "Warsaw",
    venue: "COS Torwar",
    date: "2026-10-04",
    promoter: "Example Promoter",
    capacity: "5800",
    amount: 65000,
    currency: "EUR",
    dealType: "fully delivered",
    status: "negotiating",
    notes: "Local production not included",
  },
  {
    id: 2,
    artist: "Scooter",
    city: "Stockholm",
    venue: "Hovet",
    date: "2026-09-28",
    promoter: "All Things Live",
    capacity: "8100",
    amount: 180000,
    currency: "EUR",
    dealType: "versus",
    status: "confirmed",
    notes: "Subject to final production budget",
  },
];

const initialRouting = [
  { id: 1, date: "2026-09-26", city: "Oslo", venue: "Oslo Spektrum", country: "Norway", status: "hold", travelNotes: "Nightliner from Copenhagen", order: 1 },
  { id: 2, date: "2026-09-28", city: "Stockholm", venue: "Hovet", country: "Sweden", status: "confirmed", travelNotes: "Travel day required", order: 2 },
  { id: 3, date: "2026-10-04", city: "Warsaw", venue: "COS Torwar", country: "Poland", status: "negotiating", travelNotes: "Possible routing via Riga/Tallinn", order: 3 },
];

const initialPayments = [
  {
    id: 1,
    show: "Stockholm – Hovet",
    totalFee: 180000,
    depositAmount: 90000,
    depositDue: "2026-08-20",
    depositStatus: "paid",
    balanceAmount: 90000,
    balanceDue: "2026-09-28",
    balanceStatus: "open",
    currency: "EUR",
    withholdingTax: "0%",
    commissionPercent: 10,
    commissionAmount: 18000,
    notes: "Settlement due on show day",
  },
  {
    id: 2,
    show: "Warsaw – COS Torwar",
    totalFee: 65000,
    depositAmount: 32500,
    depositDue: "2026-09-10",
    depositStatus: "open",
    balanceAmount: 32500,
    balanceDue: "2026-10-04",
    balanceStatus: "open",
    currency: "EUR",
    withholdingTax: "0%",
    commissionPercent: 10,
    commissionAmount: 6500,
    notes: "Promoter requested revised memo",
  },
];

const statusStyles = {
  pending: "secondary",
  negotiating: "secondary",
  confirmed: "default",
  passed: "outline",
  cancelled: "destructive",
  open: "secondary",
  paid: "default",
  overdue: "destructive",
  hold: "secondary",
};

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="rounded-2xl border p-3">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DataCard({ title, children, action }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function BookingSoftwareMVP() {
  const [artists, setArtists] = useState(initialArtists);
  const [promoters, setPromoters] = useState(initialPromoters);
  const [offers, setOffers] = useState(initialOffers);
  const [routing, setRouting] = useState(initialRouting);
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");

  const [newArtist, setNewArtist] = useState({ name: "", feeRange: "", territories: "", notes: "" });
  const [newPromoter, setNewPromoter] = useState({ company: "", contact: "", email: "", phone: "", territories: "", reliability: "Medium", notes: "" });
  const [newOffer, setNewOffer] = useState({ artist: "", city: "", venue: "", date: "", promoter: "", capacity: "", amount: "", currency: "EUR", dealType: "guarantee", status: "pending", notes: "" });
  const [newRoute, setNewRoute] = useState({ date: "", city: "", venue: "", country: "", status: "hold", travelNotes: "", order: "" });
  const [newPayment, setNewPayment] = useState({ show: "", totalFee: "", depositAmount: "", depositDue: "", depositStatus: "open", balanceAmount: "", balanceDue: "", balanceStatus: "open", currency: "EUR", withholdingTax: "0%", commissionPercent: "10", commissionAmount: "", notes: "" });

  const filteredOffers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return offers;
    return offers.filter((o) =>
      [o.artist, o.city, o.venue, o.promoter, o.status, o.dealType].join(" ").toLowerCase().includes(q)
    );
  }, [offers, search]);

  const stats = useMemo(() => {
    const openOffers = offers.filter((o) => ["pending", "negotiating"].includes(o.status)).length;
    const confirmedShows = offers.filter((o) => o.status === "confirmed").length;
    const overduePayments = payments.filter((p) => p.depositStatus === "overdue" || p.balanceStatus === "overdue").length;
    const expectedCommission = payments.reduce((sum, p) => sum + Number(p.commissionAmount || 0), 0);
    return { openOffers, confirmedShows, overduePayments, expectedCommission };
  }, [offers, payments]);

  const currency = (value) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Booking Software MVP</h1>
            <p className="mt-1 text-sm text-muted-foreground">Version 1 with artists, promoters, offers, routing and payment tracking.</p>
          </div>
          <div className="flex w-full items-center gap-2 md:max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search offers, cities, promoters..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Open Offers" value={stats.openOffers} subtitle="Pending or negotiating" icon={FileText} />
          <StatCard title="Confirmed Shows" value={stats.confirmedShows} subtitle="Ready for routing" icon={CalendarDays} />
          <StatCard title="Overdue Payments" value={stats.overduePayments} subtitle="Needs follow-up" icon={AlertTriangle} />
          <StatCard title="Expected Commission" value={currency(stats.expectedCommission)} subtitle="Across tracked shows" icon={CircleDollarSign} />
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 gap-2 rounded-2xl md:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="promoters">Promoters</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <DataCard title="Recent Offers">
                <div className="space-y-3">
                  {offers.slice(0, 4).map((offer) => (
                    <div key={offer.id} className="flex items-start justify-between rounded-2xl border bg-white p-4">
                      <div>
                        <p className="font-medium">{offer.artist} — {offer.city}</p>
                        <p className="text-sm text-muted-foreground">{offer.venue} · {offer.promoter}</p>
                        <p className="mt-1 text-sm">{offer.date} · {currency(offer.amount)}</p>
                      </div>
                      <Badge variant={statusStyles[offer.status] || "secondary"}>{offer.status}</Badge>
                    </div>
                  ))}
                </div>
              </DataCard>

              <DataCard title="Payment Watchlist">
                <div className="space-y-3">
                  {payments.slice(0, 4).map((payment) => (
                    <div key={payment.id} className="rounded-2xl border bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{payment.show}</p>
                          <p className="text-sm text-muted-foreground">Deposit due {payment.depositDue} · Balance due {payment.balanceDue}</p>
                        </div>
                        <Badge variant={statusStyles[payment.balanceStatus] || "secondary"}>{payment.balanceStatus}</Badge>
                      </div>
                      <p className="mt-2 text-sm">Total fee {currency(payment.totalFee)} · Commission {currency(payment.commissionAmount)}</p>
                    </div>
                  ))}
                </div>
              </DataCard>
            </div>
          </TabsContent>

          <TabsContent value="artists">
            <DataCard
              title="Artists"
              action={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-2xl"><Plus className="mr-2 h-4 w-4" />Add Artist</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader><DialogTitle>Add Artist</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div><Label>Name</Label><Input value={newArtist.name} onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })} /></div>
                      <div><Label>Fee Range</Label><Input value={newArtist.feeRange} onChange={(e) => setNewArtist({ ...newArtist, feeRange: e.target.value })} /></div>
                      <div><Label>Territories</Label><Input value={newArtist.territories} onChange={(e) => setNewArtist({ ...newArtist, territories: e.target.value })} /></div>
                      <div><Label>Notes</Label><Textarea value={newArtist.notes} onChange={(e) => setNewArtist({ ...newArtist, notes: e.target.value })} /></div>
                      <Button onClick={() => {
                        if (!newArtist.name) return;
                        setArtists([...artists, { id: Date.now(), ...newArtist }]);
                        setNewArtist({ name: "", feeRange: "", territories: "", notes: "" });
                      }}>Save Artist</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              }
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {artists.map((artist) => (
                  <div key={artist.id} className="rounded-2xl border bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border p-3"><Users className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-sm text-muted-foreground">{artist.feeRange}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm"><span className="font-medium">Territories:</span> {artist.territories}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{artist.notes}</p>
                  </div>
                ))}
              </div>
            </DataCard>
          </TabsContent>

          <TabsContent value="promoters">
            <DataCard
              title="Promoters / Partners"
              action={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-2xl"><Plus className="mr-2 h-4 w-4" />Add Promoter</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader><DialogTitle>Add Promoter</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div><Label>Company</Label><Input value={newPromoter.company} onChange={(e) => setNewPromoter({ ...newPromoter, company: e.target.value })} /></div>
                      <div><Label>Contact</Label><Input value={newPromoter.contact} onChange={(e) => setNewPromoter({ ...newPromoter, contact: e.target.value })} /></div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Email</Label><Input value={newPromoter.email} onChange={(e) => setNewPromoter({ ...newPromoter, email: e.target.value })} /></div>
                        <div><Label>Phone</Label><Input value={newPromoter.phone} onChange={(e) => setNewPromoter({ ...newPromoter, phone: e.target.value })} /></div>
                      </div>
                      <div><Label>Territories</Label><Input value={newPromoter.territories} onChange={(e) => setNewPromoter({ ...newPromoter, territories: e.target.value })} /></div>
                      <div><Label>Reliability</Label><Input value={newPromoter.reliability} onChange={(e) => setNewPromoter({ ...newPromoter, reliability: e.target.value })} /></div>
                      <div><Label>Notes</Label><Textarea value={newPromoter.notes} onChange={(e) => setNewPromoter({ ...newPromoter, notes: e.target.value })} /></div>
                      <Button onClick={() => {
                        if (!newPromoter.company) return;
                        setPromoters([...promoters, { id: Date.now(), ...newPromoter }]);
                        setNewPromoter({ company: "", contact: "", email: "", phone: "", territories: "", reliability: "Medium", notes: "" });
                      }}>Save Promoter</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              }
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {promoters.map((promoter) => (
                  <div key={promoter.id} className="rounded-2xl border bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border p-3"><Building2 className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium">{promoter.company}</p>
                        <p className="text-sm text-muted-foreground">{promoter.contact}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 text-sm">
                      <p>{promoter.email}</p>
                      <p>{promoter.phone}</p>
                      <p><span className="font-medium">Territories:</span> {promoter.territories}</p>
                      <p><span className="font-medium">Reliability:</span> {promoter.reliability}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{promoter.notes}</p>
                  </div>
                ))}
              </div>
            </DataCard>
          </TabsContent>

          <TabsContent value="offers">
            <DataCard
              title="Offers"
              action={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-2xl"><Plus className="mr-2 h-4 w-4" />Add Offer</Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader><DialogTitle>Add Offer</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2 md:grid-cols-2">
                      <div><Label>Artist</Label><Input value={newOffer.artist} onChange={(e) => setNewOffer({ ...newOffer, artist: e.target.value })} /></div>
                      <div><Label>Promoter</Label><Input value={newOffer.promoter} onChange={(e) => setNewOffer({ ...newOffer, promoter: e.target.value })} /></div>
                      <div><Label>City</Label><Input value={newOffer.city} onChange={(e) => setNewOffer({ ...newOffer, city: e.target.value })} /></div>
                      <div><Label>Venue</Label><Input value={newOffer.venue} onChange={(e) => setNewOffer({ ...newOffer, venue: e.target.value })} /></div>
                      <div><Label>Date</Label><Input type="date" value={newOffer.date} onChange={(e) => setNewOffer({ ...newOffer, date: e.target.value })} /></div>
                      <div><Label>Capacity</Label><Input value={newOffer.capacity} onChange={(e) => setNewOffer({ ...newOffer, capacity: e.target.value })} /></div>
                      <div><Label>Offer Amount</Label><Input value={newOffer.amount} onChange={(e) => setNewOffer({ ...newOffer, amount: e.target.value })} /></div>
                      <div><Label>Currency</Label><Input value={newOffer.currency} onChange={(e) => setNewOffer({ ...newOffer, currency: e.target.value })} /></div>
                      <div>
                        <Label>Deal Type</Label>
                        <Select value={newOffer.dealType} onValueChange={(value) => setNewOffer({ ...newOffer, dealType: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="guarantee">guarantee</SelectItem>
                            <SelectItem value="versus">versus</SelectItem>
                            <SelectItem value="percentage">percentage</SelectItem>
                            <SelectItem value="fully delivered">fully delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select value={newOffer.status} onValueChange={(value) => setNewOffer({ ...newOffer, status: value })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="negotiating">negotiating</SelectItem>
                            <SelectItem value="confirmed">confirmed</SelectItem>
                            <SelectItem value="passed">passed</SelectItem>
                            <SelectItem value="cancelled">cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2"><Label>Notes</Label><Textarea value={newOffer.notes} onChange={(e) => setNewOffer({ ...newOffer, notes: e.target.value })} /></div>
                      <div className="md:col-span-2">
                        <Button onClick={() => {
                          if (!newOffer.artist || !newOffer.city) return;
                          setOffers([...offers, { id: Date.now(), ...newOffer, amount: Number(newOffer.amount || 0) }]);
                          setNewOffer({ artist: "", city: "", venue: "", date: "", promoter: "", capacity: "", amount: "", currency: "EUR", dealType: "guarantee", status: "pending", notes: "" });
                        }}>Save Offer</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              }
            >
              <div className="space-y-3">
                {filteredOffers.map((offer) => (
                  <div key={offer.id} className="rounded-2xl border bg-white p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-base font-medium">{offer.artist} — {offer.city}</p>
                        <p className="text-sm text-muted-foreground">{offer.venue} · {offer.promoter}</p>
                        <p className="mt-1 text-sm">{offer.date} · Capacity {offer.capacity || "—"} · {currency(offer.amount)}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{offer.dealType} · {offer.notes}</p>
                      </div>
                      <Badge variant={statusStyles[offer.status] || "secondary"}>{offer.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </DataCard>
          </TabsContent>

          <TabsContent value="routing">
            <DataCard
              title="Routing"
              action={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-2xl"><Plus className="mr-2 h-4 w-4" />Add Route Stop</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader><DialogTitle>Add Route Stop</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Date</Label><Input type="date" value={newRoute.date} onChange={(e) => setNewRoute({ ...newRoute, date: e.target.value })} /></div>
                        <div><Label>Order</Label><Input value={newRoute.order} onChange={(e) => setNewRoute({ ...newRoute, order: e.target.value })} /></div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>City</Label><Input value={newRoute.city} onChange={(e) => setNewRoute({ ...newRoute, city: e.target.value })} /></div>
                        <div><Label>Country</Label><Input value={newRoute.country} onChange={(e) => setNewRoute({ ...newRoute, country: e.target.value })} /></div>
                      </div>
                      <div><Label>Venue</Label><Input value={newRoute.venue} onChange={(e) => setNewRoute({ ...newRoute, venue: e.target.value })} /></div>
                      <div><Label>Status</Label><Input value={newRoute.status} onChange={(e) => setNewRoute({ ...newRoute, status: e.target.value })} /></div>
                      <div><Label>Travel Notes</Label><Textarea value={newRoute.travelNotes} onChange={(e) => setNewRoute({ ...newRoute, travelNotes: e.target.value })} /></div>
                      <Button onClick={() => {
                        if (!newRoute.city) return;
                        setRouting([...routing, { id: Date.now(), ...newRoute, order: Number(newRoute.order || routing.length + 1) }].sort((a, b) => a.order - b.order));
                        setNewRoute({ date: "", city: "", venue: "", country: "", status: "hold", travelNotes: "", order: "" });
                      }}>Save Route Stop</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              }
            >
              <div className="space-y-3">
                {routing.map((stop) => (
                  <div key={stop.id} className="flex flex-col gap-3 rounded-2xl border bg-white p-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl border p-3"><MapPinned className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium">#{stop.order} · {stop.city}, {stop.country}</p>
                        <p className="text-sm text-muted-foreground">{stop.venue} · {stop.date}</p>
                        <p className="mt-1 text-sm">{stop.travelNotes}</p>
                      </div>
                    </div>
                    <Badge variant={statusStyles[stop.status] || "secondary"}>{stop.status}</Badge>
                  </div>
                ))}
              </div>
            </DataCard>
          </TabsContent>

          <TabsContent value="payments">
            <DataCard
              title="Payments"
              action={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-2xl"><Plus className="mr-2 h-4 w-4" />Add Payment</Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader><DialogTitle>Add Payment Entry</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2 md:grid-cols-2">
                      <div className="md:col-span-2"><Label>Show</Label><Input value={newPayment.show} onChange={(e) => setNewPayment({ ...newPayment, show: e.target.value })} /></div>
                      <div><Label>Total Fee</Label><Input value={newPayment.totalFee} onChange={(e) => setNewPayment({ ...newPayment, totalFee: e.target.value })} /></div>
                      <div><Label>Currency</Label><Input value={newPayment.currency} onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value })} /></div>
                      <div><Label>Deposit Amount</Label><Input value={newPayment.depositAmount} onChange={(e) => setNewPayment({ ...newPayment, depositAmount: e.target.value })} /></div>
                      <div><Label>Deposit Due</Label><Input type="date" value={newPayment.depositDue} onChange={(e) => setNewPayment({ ...newPayment, depositDue: e.target.value })} /></div>
                      <div><Label>Deposit Status</Label><Input value={newPayment.depositStatus} onChange={(e) => setNewPayment({ ...newPayment, depositStatus: e.target.value })} /></div>
                      <div><Label>Balance Amount</Label><Input value={newPayment.balanceAmount} onChange={(e) => setNewPayment({ ...newPayment, balanceAmount: e.target.value })} /></div>
                      <div><Label>Balance Due</Label><Input type="date" value={newPayment.balanceDue} onChange={(e) => setNewPayment({ ...newPayment, balanceDue: e.target.value })} /></div>
                      <div><Label>Balance Status</Label><Input value={newPayment.balanceStatus} onChange={(e) => setNewPayment({ ...newPayment, balanceStatus: e.target.value })} /></div>
                      <div><Label>Withholding Tax</Label><Input value={newPayment.withholdingTax} onChange={(e) => setNewPayment({ ...newPayment, withholdingTax: e.target.value })} /></div>
                      <div><Label>Commission %</Label><Input value={newPayment.commissionPercent} onChange={(e) => setNewPayment({ ...newPayment, commissionPercent: e.target.value })} /></div>
                      <div><Label>Commission Amount</Label><Input value={newPayment.commissionAmount} onChange={(e) => setNewPayment({ ...newPayment, commissionAmount: e.target.value })} /></div>
                      <div className="md:col-span-2"><Label>Notes</Label><Textarea value={newPayment.notes} onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })} /></div>
                      <div className="md:col-span-2">
                        <Button onClick={() => {
                          if (!newPayment.show) return;
                          setPayments([...payments, {
                            id: Date.now(),
                            ...newPayment,
                            totalFee: Number(newPayment.totalFee || 0),
                            depositAmount: Number(newPayment.depositAmount || 0),
                            balanceAmount: Number(newPayment.balanceAmount || 0),
                            commissionPercent: Number(newPayment.commissionPercent || 0),
                            commissionAmount: Number(newPayment.commissionAmount || 0),
                          }]);
                          setNewPayment({ show: "", totalFee: "", depositAmount: "", depositDue: "", depositStatus: "open", balanceAmount: "", balanceDue: "", balanceStatus: "open", currency: "EUR", withholdingTax: "0%", commissionPercent: "10", commissionAmount: "", notes: "" });
                        }}>Save Payment</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              }
            >
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="rounded-2xl border bg-white p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-medium">{payment.show}</p>
                        <p className="text-sm text-muted-foreground">Total fee {currency(payment.totalFee)} · Withholding {payment.withholdingTax}</p>
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          <div className="rounded-xl border p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Deposit</p>
                            <p className="mt-1 font-medium">{currency(payment.depositAmount)}</p>
                            <p className="text-sm text-muted-foreground">Due {payment.depositDue}</p>
                          </div>
                          <div className="rounded-xl border p-3">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Balance</p>
                            <p className="mt-1 font-medium">{currency(payment.balanceAmount)}</p>
                            <p className="text-sm text-muted-foreground">Due {payment.balanceDue}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm">Commission {payment.commissionPercent}% · {currency(payment.commissionAmount)}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{payment.notes}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={statusStyles[payment.depositStatus] || "secondary"}>deposit {payment.depositStatus}</Badge>
                        <Badge variant={statusStyles[payment.balanceStatus] || "secondary"}>balance {payment.balanceStatus}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DataCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
