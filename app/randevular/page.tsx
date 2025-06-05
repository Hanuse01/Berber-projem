'use client';
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, addMonths } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function Randevular() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  // Çalışma saatleri
  const workingHours = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  useEffect(() => {
    // Hizmetleri yükle
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      // Seçilen tarih ve hizmet için müsait saatleri kontrol et
      fetch(`/api/appointments/available?date=${format(selectedDate, 'yyyy-MM-dd')}&serviceId=${selectedService}`)
        .then(res => res.json())
        .then(availableSlots => {
          const slots = workingHours.map(time => ({
            time,
            available: availableSlots.includes(time)
          }));
          setTimeSlots(slots);
        });
    }
  }, [selectedDate, selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedService || !selectedTime) return;

    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceId: selectedService,
        date: format(selectedDate, 'yyyy-MM-dd') + 'T' + selectedTime,
      }),
    });

    if (response.ok) {
      alert('Randevunuz başarıyla oluşturuldu!');
      // Formu sıfırla
      setSelectedDate(new Date());
      setSelectedService('');
      setSelectedTime('');
    } else {
      alert('Randevu oluşturulurken bir hata oluştu.');
    }
  };

  // Takvim için tarih aralığı
  const fromDate = new Date();
  const toDate = addMonths(new Date(), 1); // 1 ay sonrasına kadar

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Randevu Al</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Takvim */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Tarih Seçin</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={(date) => date < fromDate || date > toDate}
              locale={tr}
              className="rounded-md border"
              fromDate={fromDate}
              toDate={toDate}
            />
          </div>

          {/* Hizmet ve Saat Seçimi */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Hizmet ve Saat Seçin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hizmet
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Hizmet Seçin</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.price}₺
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müsait Saatler
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-2 rounded-md text-sm ${
                        slot.available
                          ? selectedTime === slot.time
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                disabled={!selectedService || !selectedDate || !selectedTime}
              >
                Randevu Oluştur
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 