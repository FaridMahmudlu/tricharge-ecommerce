import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';

const SupportContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #2c5282 0%, #4299e1 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ContactCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #f8fafc;
  min-height: 250px;
  justify-content: center;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
  transform: none;

  &:hover {
    transform: translateY(-5px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #2c5282 0%, #4299e1 100%);
  }

  h3 {
    color: #2c5282;
    font-size: 1.5rem;
    margin: 1.25rem 0 1rem;
    font-weight: 600;
  }

  p {
    margin: 0.5rem 0;
    color: #4a5568;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .contact-info {
    color: #2d3748;
    font-weight: 500;
    font-size: 1.2rem;
    margin: 0.75rem 0;
  }

  .availability {
    font-size: 0.95rem;
    color: #718096;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    width: 100%;
  }
`;

const IconWrapper = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #2c5282 0%, #4299e1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  ${ContactCard}:hover & {
    transform: scale(1.1);
  }
`;

const SectionTitle = styled.h2`
  color: #2c5282;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 600;
`;

const FAQItem = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1.5rem;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  p {
    color: #4a5568;
    line-height: 1.6;
  }
`;

const Question = styled.h3`
  color: #2c5282;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    color: #4299e1;
  }
`;

const Answer = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => (props.$isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
  opacity: ${props => (props.$isOpen ? '1' : '0')};
`;

interface FAQProps {
  question: string;
  answer: string;
}

const FAQ: React.FC<FAQProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FAQItem>
      <Question onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span>{isOpen ? '−' : '+'}</span>
      </Question>
      <Answer $isOpen={isOpen}>
        <p>{answer}</p>
      </Answer>
    </FAQItem>
  );
};

const SurveySection = styled(Card)`
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 150px;
  grid-column: 1 / -1;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #2c5282 0%, #4299e1 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  grid-column: 1 / -1;
  width: fit-content;
  justify-self: end;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PhoneInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  grid-column: span 2;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 0.5rem;
  }
`;

const CountrySelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: white;
  cursor: pointer;
  width: 140px;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  option {
    &:not(:checked) {
      color: #4a5568;
    }
  }
`;

const PhoneInput = styled(Input)`
  flex: 1;
`;

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    comments: ''
  });

  const countryCodes = [
    { code: '+93', country: 'Afghanistan' },
    { code: '+355', country: 'Albania' },
    { code: '+213', country: 'Algeria' },
    { code: '+376', country: 'Andorra' },
    { code: '+244', country: 'Angola' },
    { code: '+1', country: 'Antigua and Barbuda' },
    { code: '+54', country: 'Argentina' },
    { code: '+374', country: 'Armenia' },
    { code: '+61', country: 'Australia' },
    { code: '+43', country: 'Austria' },
    { code: '+994', country: 'Azerbaijan' },
    { code: '+1', country: 'Bahamas' },
    { code: '+973', country: 'Bahrain' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+1', country: 'Barbados' },
    { code: '+375', country: 'Belarus' },
    { code: '+32', country: 'Belgium' },
    { code: '+501', country: 'Belize' },
    { code: '+229', country: 'Benin' },
    { code: '+975', country: 'Bhutan' },
    { code: '+591', country: 'Bolivia' },
    { code: '+387', country: 'Bosnia and Herzegovina' },
    { code: '+267', country: 'Botswana' },
    { code: '+55', country: 'Brazil' },
    { code: '+673', country: 'Brunei' },
    { code: '+359', country: 'Bulgaria' },
    { code: '+226', country: 'Burkina Faso' },
    { code: '+257', country: 'Burundi' },
    { code: '+855', country: 'Cambodia' },
    { code: '+237', country: 'Cameroon' },
    { code: '+1', country: 'Canada' },
    { code: '+238', country: 'Cape Verde' },
    { code: '+236', country: 'Central African Republic' },
    { code: '+235', country: 'Chad' },
    { code: '+56', country: 'Chile' },
    { code: '+86', country: 'China' },
    { code: '+57', country: 'Colombia' },
    { code: '+269', country: 'Comoros' },
    { code: '+242', country: 'Congo' },
    { code: '+243', country: 'Congo, Democratic Republic of the' },
    { code: '+506', country: 'Costa Rica' },
    { code: '+225', country: "Côte d'Ivoire" },
    { code: '+385', country: 'Croatia' },
    { code: '+53', country: 'Cuba' },
    { code: '+357', country: 'Cyprus' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+45', country: 'Denmark' },
    { code: '+253', country: 'Djibouti' },
    { code: '+1', country: 'Dominica' },
    { code: '+1', country: 'Dominican Republic' },
    { code: '+670', country: 'East Timor' },
    { code: '+593', country: 'Ecuador' },
    { code: '+20', country: 'Egypt' },
    { code: '+503', country: 'El Salvador' },
    { code: '+240', country: 'Equatorial Guinea' },
    { code: '+291', country: 'Eritrea' },
    { code: '+372', country: 'Estonia' },
    { code: '+251', country: 'Ethiopia' },
    { code: '+679', country: 'Fiji' },
    { code: '+358', country: 'Finland' },
    { code: '+33', country: 'France' },
    { code: '+241', country: 'Gabon' },
    { code: '+220', country: 'Gambia' },
    { code: '+995', country: 'Georgia' },
    { code: '+49', country: 'Germany' },
    { code: '+233', country: 'Ghana' },
    { code: '+30', country: 'Greece' },
    { code: '+1', country: 'Grenada' },
    { code: '+502', country: 'Guatemala' },
    { code: '+224', country: 'Guinea' },
    { code: '+245', country: 'Guinea-Bissau' },
    { code: '+592', country: 'Guyana' },
    { code: '+509', country: 'Haiti' },
    { code: '+504', country: 'Honduras' },
    { code: '+852', country: 'Hong Kong' },
    { code: '+36', country: 'Hungary' },
    { code: '+354', country: 'Iceland' },
    { code: '+91', country: 'India' },
    { code: '+62', country: 'Indonesia' },
    { code: '+98', country: 'Iran' },
    { code: '+964', country: 'Iraq' },
    { code: '+353', country: 'Ireland' },
    { code: '+972', country: 'Israel' },
    { code: '+39', country: 'Italy' },
    { code: '+1', country: 'Jamaica' },
    { code: '+81', country: 'Japan' },
    { code: '+962', country: 'Jordan' },
    { code: '+7', country: 'Kazakhstan' },
    { code: '+254', country: 'Kenya' },
    { code: '+686', country: 'Kiribati' },
    { code: '+82', country: 'Korea, South' },
    { code: '+965', country: 'Kuwait' },
    { code: '+996', country: 'Kyrgyzstan' },
    { code: '+856', country: 'Laos' },
    { code: '+371', country: 'Latvia' },
    { code: '+961', country: 'Lebanon' },
    { code: '+266', country: 'Lesotho' },
    { code: '+231', country: 'Liberia' },
    { code: '+218', country: 'Libya' },
    { code: '+423', country: 'Liechtenstein' },
    { code: '+370', country: 'Lithuania' },
    { code: '+352', country: 'Luxembourg' },
    { code: '+853', country: 'Macau' },
    { code: '+389', country: 'Macedonia' },
    { code: '+261', country: 'Madagascar' },
    { code: '+265', country: 'Malawi' },
    { code: '+60', country: 'Malaysia' },
    { code: '+960', country: 'Maldives' },
    { code: '+223', country: 'Mali' },
    { code: '+356', country: 'Malta' },
    { code: '+692', country: 'Marshall Islands' },
    { code: '+222', country: 'Mauritania' },
    { code: '+230', country: 'Mauritius' },
    { code: '+52', country: 'Mexico' },
    { code: '+691', country: 'Micronesia' },
    { code: '+373', country: 'Moldova' },
    { code: '+377', country: 'Monaco' },
    { code: '+976', country: 'Mongolia' },
    { code: '+382', country: 'Montenegro' },
    { code: '+212', country: 'Morocco' },
    { code: '+258', country: 'Mozambique' },
    { code: '+95', country: 'Myanmar' },
    { code: '+264', country: 'Namibia' },
    { code: '+674', country: 'Nauru' },
    { code: '+977', country: 'Nepal' },
    { code: '+31', country: 'Netherlands' },
    { code: '+64', country: 'New Zealand' },
    { code: '+505', country: 'Nicaragua' },
    { code: '+227', country: 'Niger' },
    { code: '+234', country: 'Nigeria' },
    { code: '+47', country: 'Norway' },
    { code: '+968', country: 'Oman' },
    { code: '+92', country: 'Pakistan' },
    { code: '+680', country: 'Palau' },
    { code: '+970', country: 'Palestine' },
    { code: '+507', country: 'Panama' },
    { code: '+675', country: 'Papua New Guinea' },
    { code: '+595', country: 'Paraguay' },
    { code: '+51', country: 'Peru' },
    { code: '+63', country: 'Philippines' },
    { code: '+48', country: 'Poland' },
    { code: '+351', country: 'Portugal' },
    { code: '+974', country: 'Qatar' },
    { code: '+40', country: 'Romania' },
    { code: '+7', country: 'Russia' },
    { code: '+250', country: 'Rwanda' },
    { code: '+1', country: 'Saint Kitts and Nevis' },
    { code: '+1', country: 'Saint Lucia' },
    { code: '+1', country: 'Saint Vincent and the Grenadines' },
    { code: '+685', country: 'Samoa' },
    { code: '+378', country: 'San Marino' },
    { code: '+239', country: 'Sao Tome and Principe' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+221', country: 'Senegal' },
    { code: '+381', country: 'Serbia' },
    { code: '+248', country: 'Seychelles' },
    { code: '+232', country: 'Sierra Leone' },
    { code: '+65', country: 'Singapore' },
    { code: '+421', country: 'Slovakia' },
    { code: '+386', country: 'Slovenia' },
    { code: '+677', country: 'Solomon Islands' },
    { code: '+252', country: 'Somalia' },
    { code: '+27', country: 'South Africa' },
    { code: '+211', country: 'South Sudan' },
    { code: '+34', country: 'Spain' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+249', country: 'Sudan' },
    { code: '+597', country: 'Suriname' },
    { code: '+268', country: 'Swaziland' },
    { code: '+46', country: 'Sweden' },
    { code: '+41', country: 'Switzerland' },
    { code: '+963', country: 'Syria' },
    { code: '+886', country: 'Taiwan' },
    { code: '+992', country: 'Tajikistan' },
    { code: '+255', country: 'Tanzania' },
    { code: '+66', country: 'Thailand' },
    { code: '+228', country: 'Togo' },
    { code: '+676', country: 'Tonga' },
    { code: '+1', country: 'Trinidad and Tobago' },
    { code: '+216', country: 'Tunisia' },
    { code: '+90', country: 'Turkey' },
    { code: '+993', country: 'Turkmenistan' },
    { code: '+688', country: 'Tuvalu' },
    { code: '+256', country: 'Uganda' },
    { code: '+380', country: 'Ukraine' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+1', country: 'United States' },
    { code: '+598', country: 'Uruguay' },
    { code: '+998', country: 'Uzbekistan' },
    { code: '+678', country: 'Vanuatu' },
    { code: '+379', country: 'Vatican City' },
    { code: '+58', country: 'Venezuela' },
    { code: '+84', country: 'Vietnam' },
    { code: '+967', country: 'Yemen' },
    { code: '+260', country: 'Zambia' },
    { code: '+263', country: 'Zimbabwe' }
  ].sort((a, b) => a.country.localeCompare(b.country));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+1',
      phone: '',
      comments: ''
    });
    alert('Thank you for your feedback!');
  };

  const faqs = [
    {
      question: "What devices are compatible with your chargers?",
      answer: "Our wireless chargers are compatible with all Qi-enabled devices, including latest iPhone and Android smartphones. This includes iPhone 8 and newer, Samsung Galaxy S6 and newer, and many other modern smartphones."
    },
    {
      question: "What's your warranty policy?",
      answer: "All our products come with a comprehensive 12-month warranty against manufacturing defects. This covers any issues related to normal use of the product. We also offer a 30-day money-back guarantee for any reason."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the continental US. We also offer express shipping (1-2 business days) and international shipping options. All orders are processed within 24 hours."
    },
    {
      question: "How do I clean my wireless charger?",
      answer: "To clean your wireless charger, unplug it first and use a slightly damp microfiber cloth. Avoid using harsh chemicals or getting water inside the charging ports. Make sure the charger is completely dry before using it again."
    }
  ];

  return (
    <SupportContainer>
      <HeroSection>
        <Title>How Can We Help?</Title>
        <Subtitle>
          Get instant answers to common questions or reach out to our support team
        </Subtitle>
      </HeroSection>

      <SurveySection>
        <SectionTitle>Share Your Feedback</SectionTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone Number</Label>
            <PhoneInputGroup>
              <CountrySelect
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                required
              >
                {countryCodes.map(({ code, country }) => (
                  <option key={code} value={code}>
                    {code} - {country}
                  </option>
                ))}
              </CountrySelect>
              <PhoneInput
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="123-456-7890"
                required
              />
            </PhoneInputGroup>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="comments">Comments</Label>
            <TextArea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              required
              placeholder="Please share your thoughts, suggestions, or concerns..."
            />
          </FormGroup>
          <SubmitButton type="submit">Submit Feedback</SubmitButton>
        </Form>
      </SurveySection>

      <Grid>
        <ContactCard>
          <IconWrapper>📧</IconWrapper>
          <h3>Email Support</h3>
          <p>Get detailed assistance from our support team</p>
          <p className="contact-info">support@tricharge.com</p>
          <div className="availability">
            <p>Response within 24 hours</p>
            <p>Available for all inquiries</p>
          </div>
        </ContactCard>

        <ContactCard>
          <IconWrapper>📞</IconWrapper>
          <h3>Phone Support</h3>
          <p>Speak directly with our product experts</p>
          <p className="contact-info">1-800-CHARGE</p>
          <div className="availability">
            <p>Mon-Fri, 9AM-6PM EST</p>
            <p>Priority support for urgent issues</p>
          </div>
        </ContactCard>
      </Grid>

      <Card>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        {faqs.map((faq, index) => (
          <FAQ key={index} question={faq.question} answer={faq.answer} />
        ))}
      </Card>
    </SupportContainer>
  );
};

export default Support; 